import '@astrojs/internal-helpers/path';
import 'cookie';
import { N as NOOP_MIDDLEWARE_HEADER, h as decodeKey } from './chunks/astro/server_kEQQ3WNW.mjs';
import 'es-module-lexer';
import 'clsx';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || undefined,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : undefined,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/jeremypogue/Desktop/scream-website/","adapterName":"@astrojs/netlify","routes":[{"file":"join/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/join","isIndex":false,"type":"page","pattern":"^\\/join\\/?$","segments":[[{"content":"join","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/join.astro","pathname":"/join","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"members/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/members","isIndex":false,"type":"page","pattern":"^\\/members\\/?$","segments":[[{"content":"members","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/members.astro","pathname":"/members","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"people/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/people","isIndex":false,"type":"page","pattern":"^\\/people\\/?$","segments":[[{"content":"people","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/people.astro","pathname":"/people","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/jeremypogue/Desktop/scream-website/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/jeremypogue/Desktop/scream-website/src/pages/join.astro",{"propagation":"none","containsHead":true}],["/Users/jeremypogue/Desktop/scream-website/src/pages/members.astro",{"propagation":"none","containsHead":true}],["/Users/jeremypogue/Desktop/scream-website/src/pages/people.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/join@_@astro":"pages/join.astro.mjs","\u0000@astro-page:src/pages/members@_@astro":"pages/members.astro.mjs","\u0000@astro-page:src/pages/people@_@astro":"pages/people.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BrlwLkvC.mjs","/Users/jeremypogue/Desktop/scream-website/src/components/ClubCarousel.astro?astro&type=script&index=0&lang.ts":"_astro/ClubCarousel.astro_astro_type_script_index_0_lang.DWG7cRzq.js","/Users/jeremypogue/Desktop/scream-website/src/components/AppHeader.astro?astro&type=script&index=0&lang.ts":"_astro/AppHeader.astro_astro_type_script_index_0_lang.C4u4i8AB.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/jeremypogue/Desktop/scream-website/src/components/ClubCarousel.astro?astro&type=script&index=0&lang.ts","(function(){const l=document.querySelector('[data-component=\"club-carousel\"]');if(!l)return;const t=l.querySelector(\".carousel\"),v=t&&t.querySelector(\".carousel-track\"),u=t?Array.from(t.querySelectorAll(\".carousel-slide\")):[],y=u.map(e=>e.querySelector(\"img\")),L=t?Array.from(t.querySelectorAll(\".carousel-dot\")):[],A=t&&t.querySelector('[data-action=\"prev\"]'),g=t&&t.querySelector('[data-action=\"next\"]'),w=Number(l.dataset.interval)||6e3,k=Math.max(1,Number(l.dataset.preloadahead)||1);if(!v||u.length===0)return;let o=0,f=null;const i=u.length;function S(){v.style.transform=`translateX(-${o*100}%)`,u.forEach((e,r)=>e.setAttribute(\"aria-hidden\",r!==o)),L.forEach((e,r)=>e.classList.toggle(\"active\",r===o)),q(o),x(o,k)}function h(e){o=(e%i+i)%i,S()}function p(){h(o+1)}function m(){h(o-1)}function E(){c(),f=setInterval(p,w)}function c(){f&&(clearInterval(f),f=null)}function q(e){y.forEach((r,a)=>{if(!r)return;const s=r.closest(\".img-wrapper\");if(a===e){try{r.loading=\"eager\"}catch{}try{r.setAttribute(\"fetchpriority\",\"high\")}catch{}r.decoding=\"async\",r.complete&&s?.classList.add(\"img-loaded\")}else{try{r.loading=\"lazy\"}catch{}try{r.setAttribute(\"fetchpriority\",\"auto\")}catch{}}})}function x(e,r=1){const a=new Set;for(let s=1;s<=r;s++)a.add((e+s)%i),a.add((e-s+i)%i);a.forEach(s=>{const n=y[s];if(!n)return;if(!n.complete){const d=new Image;d.src=n.src}const X=`link[data-preload=\"${n.src}\"]`;if(!document.querySelector(X)){const d=document.createElement(\"link\");d.rel=\"preload\",d.as=\"image\",d.href=n.src,d.setAttribute(\"data-preload\",n.src),document.head.appendChild(d)}})}y.forEach(e=>{e&&e.addEventListener(\"load\",r=>{const a=e.closest(\".img-wrapper\");a&&a.classList.add(\"img-loaded\")})}),h(0),E(),L.forEach(e=>{e.addEventListener(\"click\",()=>{const r=Number(e.dataset.index);h(r),c()})}),A&&A.addEventListener(\"click\",()=>{m(),c()}),g&&g.addEventListener(\"click\",()=>{p(),c()}),t.addEventListener(\"mouseenter\",c),t.addEventListener(\"mouseleave\",E),t.addEventListener(\"focusin\",c),t.addEventListener(\"focusout\",E),t.tabIndex=0,t.addEventListener(\"keydown\",e=>{e.key===\"ArrowRight\"&&(p(),c()),e.key===\"ArrowLeft\"&&(m(),c())});let b=0;t.addEventListener(\"touchstart\",e=>{b=e.changedTouches[0].screenX,c()},{passive:!0}),t.addEventListener(\"touchend\",e=>{const a=e.changedTouches[0].screenX-b;Math.abs(a)>40&&(a<0?p():m()),E()},{passive:!0})})();"],["/Users/jeremypogue/Desktop/scream-website/src/components/AppHeader.astro?astro&type=script&index=0&lang.ts","let e=!1;const t=document.querySelector(\"#nav\"),s=document.querySelector(\"#hamburger\"),c=[...t.querySelector(\"#links-group\").children];function n(){e?t.dataset.state=\"active\":t.dataset.state=\"\"}s&&s.addEventListener(\"click\",()=>{e=!e,n()});c.forEach(a=>{a.addEventListener(\"click\",()=>{e=!e,n()})});document.addEventListener(\"keydown\",a=>{a.key===\"Escape\"&&t.dataset.state===\"active\"&&(e=!1,n())});"]],"assets":["/_astro/index.DHFoyWsS.css","/_astro/index.BdJjQ6lI.css","/astrolus-dark.png","/astrolus-light.png","/favicon.svg","/images/logo.png","/images/pie.svg","/images/avatars/avatar-1.webp","/images/avatars/avatar-2.webp","/images/avatars/avatar-3.webp","/images/avatars/avatar-4.webp","/images/avatars/avatar.webp","/images/clients/airbnb.svg","/images/clients/ge.svg","/images/clients/google-cloud.svg","/images/clients/google.svg","/images/clients/knotts.svg","/images/clients/microsoft.svg","/images/clients/netflix.svg","/images/clients/uc.svg","/images/clients/udx.svg","/images/clients/universal.svg","/images/clients/wdi.svg","/images/scream-usc/scream-usc-dreamlab.jpeg","/images/scream-usc/scream-usc-iaapa.jpeg","/images/scream-usc/scream-usc-mcn.jpeg","/images/scream-usc/scream-usc-meow-wolf.jpeg","/images/scream-usc/scream-usc-universal.jpeg","/images/scream-usc/scream-usc-workshop.jpeg","/join/index.html","/members/index.html","/people/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"ycA7Y3fcsjLtnIAZVoSe+wAztXUxe2h7SSKc7wAqSGc="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
