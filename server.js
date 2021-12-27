/*
 * @Descripttion:
 * @Version: v0.1
 * @Author: pengfei.xiu
 * @Date: 2021-10-11 16:38:07
 * @LastEditors: pengfei.xiu
 * @LastEditTime: 2021-10-12 16:54:16
 */
const path = require("path");
const fs = require("fs");
const Koa = require("koa");

const compilerSfc = require("@vue/compiler-sfc");
const compilerDom = require("@vue/compiler-dom");
const Scss = require("sass");

const server = new Koa();

const NODULES = "/@modules/";

const rewrite = (con) => {
  return con.replace(/ from ['|"]([^'"]+)['|"]/g, (s0, s1) => {
    if (!s1.startsWith("./")) {
      return ` from '${NODULES}${s1}'`;
    }
    return s0;
  });
};

const rewriteCssUrl = (con) => {
  return con.replace(/url\(['|"]([^'"()]+)['|"]\)/g, (s0, s1) => {
    if (!s1.startsWith("./")) {
      return `url(/@files/${s1})`;
    }
    return s0;
  });
};

const getAppendStyleToHeadStr = (css) => {
  css = rewriteCssUrl(css.replace(/\n/g, ""));
  return `
   const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = \`${css}\`;
    document.head.appendChild(style);
    export default \`${css}\`;
  `;
};

server.on("error", () => {});

server.use(async (ctx) => {
  // console.log(ctx.request.query);
  const {
    request: { url, query },
  } = ctx;

  if (url === "/") {
    ctx.type = "text/html";
    const content = fs.readFileSync("./index.html", "utf-8");
    ctx.body = content.replace(
      "<script",
      `
    <script>
      window.process = {
        env: {NODE_ENV: 'production'}
      }
    </script>
    <script
    `
    );
  } else if (url.endsWith(".scss")) {
    ctx.type = "application/javascript";
    const scss = Scss.renderSync({
      file: path.resolve(__dirname, url.slice(1)),
    });
    ctx.body = getAppendStyleToHeadStr(scss.css.toString());
  } else if (url.endsWith(".css")) {
    ctx.type = "application/javascript";
    const content = fs.readFileSync(
      path.resolve(__dirname, url.slice(1)),
      "utf-8"
    );

    ctx.body = getAppendStyleToHeadStr(content);
  } else if (url.endsWith(".js")) {
    ctx.type = "application/javascript";
    const content = fs.readFileSync(
      path.resolve(__dirname, url.slice(1)),
      "utf-8"
    );
    ctx.body = rewrite(content);
  } else if (url.startsWith("/@files/")) {
    ctx.type = "image/png";
    const f = fs.readFileSync(
      path.resolve(__dirname, "src", url.replace("/@files/", ""))
    );
    ctx.body = f;
  } else if (url.startsWith(NODULES)) {
    ctx.type = "application/javascript";
    const prefix = path.resolve(
      __dirname,
      "node_modules",
      url.replace(NODULES, "")
    );
    const content = fs.readFileSync(
      path.join(prefix, require(prefix + "/package.json").module),
      "utf-8"
    );
    ctx.body = rewrite(content);
  } else if (url.includes(".vue")) {
    ctx.type = "application/javascript";
    const content = fs.readFileSync(
      path.resolve(__dirname, url.split("?")[0].slice(1)),
      "utf-8"
    );
    //  https://www.jianshu.com/p/f45d8d45b1dc
    const { descriptor } = compilerSfc.parse(content);
    // console.log(descriptor);

    if (!query.type) {
      // descriptor.styles.forEach((item) => {
      //   console.log("---", JSON.stringify(item));
      // });
      // TODO
      const css = descriptor.styles
        .map((style) => {
          switch (style.attrs.lang) {
            case "css":
              return style.content;
          }
        })
        .join("");

      const styleContents = `
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = \`${css.replace(/\n/g, "")}\`;
    document.head.appendChild(style);
    `;
      const script = descriptor.scriptSetup || descriptor.script;
      ctx.body = `
      ${styleContents}
      ${rewrite(
        script.content.replace("export default {", "const __script = {")
      )}
import {render as __render} from "${url}?type=template"
__script.render = __render
export default __script
      `;
    } else if (query.type === "template") {
      const code = compilerDom.compile(descriptor.template.content, {
        mode: "module",
      }).code;
      ctx.body = `
      ${rewrite(code)}
      `;
    }
  }
});

server.listen(8888, () => {});
