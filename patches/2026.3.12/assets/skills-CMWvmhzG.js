import{A as i,d as t,L as v}from"./index-CenotFkT.js";import{g as m,c as g,a as $,r as b}from"./skills-shared-BHEhPazJ.js";function h(e){const a=e.report?.skills??[],l=e.filter.trim().toLowerCase(),n=l?a.filter(s=>[s.name,s.description,s.source].join(" ").toLowerCase().includes(l)):a,d=m(n);return t`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">技能</div>
          <div class="card-sub">已安装技能及其状态。</div>
        </div>
        <button class="btn" ?disabled=${e.loading||!e.connected} @click=${e.onRefresh}>
          ${e.loading?"加载中…":"刷新"}
        </button>
      </div>

      <div class="filters" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 14px;">
        <a
          class="btn"
          href="https://clawhub.com"
          target="_blank"
          rel="noreferrer"
          title="在 ClawHub 浏览技能"
        >浏览技能商店</a>
        <label class="field" style="flex: 1; min-width: 180px;">
          <input
            .value=${e.filter}
            @input=${s=>e.onFilterChange(s.target.value)}
            placeholder="搜索技能"
          />
        </label>
        <div class="muted">${n.length} 个已显示</div>
      </div>

      ${e.error?t`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:i}

      ${n.length===0?t`
              <div class="muted" style="margin-top: 16px">
                ${!e.connected&&!e.report?"未连接到网关。":"未找到技能。"}
              </div>
            `:t`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${d.map(s=>{const o=s.id==="workspace"||s.id==="built-in";return t`
                  <details class="agent-skills-group" ?open=${!o}>
                    <summary class="agent-skills-header">
                      <span>${s.label}</span>
                      <span class="muted">${s.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${s.skills.map(c=>y(c,e))}
                    </div>
                  </details>
                `})}
            </div>
          `}
    </section>
  `}function y(e,a){const l=a.busyKey===e.skillKey,n=a.edits[e.skillKey]??"",d=a.messages[e.skillKey]??null,s=e.install.length>0&&e.missing.bins.length>0,o=!!(e.bundled&&e.source!=="openclaw-bundled"),c=g(e),r=$(e);return t`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${v(e.description,140)}</div>
        ${b({skill:e,showBundledBadge:o})}
        ${c.length>0?t`
              <div class="muted" style="margin-top: 6px;">
                缺失：${c.join(", ")}
              </div>
            `:i}
        ${r.length>0?t`
              <div class="muted" style="margin-top: 6px;">
                原因：${r.join(", ")}
              </div>
            `:i}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${l}
            @click=${()=>a.onToggle(e.skillKey,e.disabled)}
          >
            ${e.disabled?"启用":"禁用"}
          </button>
          ${s?t`<button
                class="btn"
                ?disabled=${l}
                @click=${()=>a.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${l?"安装中…":e.install[0].label}
              </button>`:i}
        </div>
        ${d?t`<div
              class="muted"
              style="margin-top: 8px; color: ${d.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${d.message}
            </div>`:i}
        ${e.primaryEnv?t`
              <div class="field" style="margin-top: 10px;">
                <span>API 密钥</span>
                <input
                  type="password"
                  .value=${n}
                  @input=${u=>a.onEdit(e.skillKey,u.target.value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${l}
                @click=${()=>a.onSaveKey(e.skillKey)}
              >
                保存密钥
              </button>
            `:i}
      </div>
    </div>
  `}export{h as renderSkills};
//# sourceMappingURL=skills-CMWvmhzG.js.map
