import{A as d,d as a}from"./index-CenotFkT.js";const e=[{id:"workspace",label:"工作区技能",sources:["openclaw-workspace"]},{id:"built-in",label:"内置技能",sources:["openclaw-bundled"]},{id:"installed",label:"已安装技能",sources:["openclaw-managed"]},{id:"extra",label:"扩展技能",sources:["openclaw-extra"]}];function u(i){const s=new Map;for(const l of e)s.set(l.id,{id:l.id,label:l.label,skills:[]});const n=e.find(l=>l.id==="built-in"),o={id:"other",label:"其他技能",skills:[]};for(const l of i){const t=l.bundled?n:e.find(p=>p.sources.includes(l.source));t?s.get(t.id)?.skills.push(l):o.skills.push(l)}const c=e.map(l=>s.get(l.id)).filter(l=>!!(l&&l.skills.length>0));return o.skills.length>0&&c.push(o),c}function b(i){return[...i.missing.bins.map(s=>`bin:${s}`),...i.missing.env.map(s=>`env:${s}`),...i.missing.config.map(s=>`config:${s}`),...i.missing.os.map(s=>`os:${s}`)]}function h(i){const s=[];return i.disabled&&s.push("已禁用"),i.blockedByAllowlist&&s.push("blocked by allowlist"),s}function k(i){const s=i.skill,n=!!i.showBundledBadge;return a`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${s.source}</span>
      ${n?a`
              <span class="chip">bundled</span>
            `:d}
      <span class="chip ${s.eligible?"chip-ok":"chip-warn"}">
        ${s.eligible?"可用":"受阻"}
      </span>
      ${s.disabled?a`
              <span class="chip chip-warn">disabled</span>
            `:d}
    </div>
  `}export{h as a,b as c,u as g,k as r};
//# sourceMappingURL=skills-shared-BHEhPazJ.js.map
