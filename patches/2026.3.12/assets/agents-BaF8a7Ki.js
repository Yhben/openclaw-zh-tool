import{r as p,a as M,b as E,n as H,c as Y,A as o,d as i,e as K,p as O,i as N,o as Q,t as V,f as z,g as X,h as U,j as Z,k as ee,l as le,m as te,q as ne,s as ie,u as se,v as B,w as R,x as ae,y as _,z as j}from"./index-CenotFkT.js";import{r as oe}from"./channel-config-extras-BkKp7v9q.js";import{g as de,c as ce,a as ge,r as re}from"./skills-shared-BHEhPazJ.js";function ve(e){const{agent:n,configForm:t,agentFilesList:s,configLoading:l,configSaving:c,configDirty:v,onConfigReload:b,onConfigSave:a,onModelChange:$,onModelFallbacksChange:h,onSelectPanel:A}=e,r=p(t,n.id),L=(s&&s.agentId===n.id?s.workspace:null)||r.entry?.workspace||r.defaults?.workspace||"default",F=r.entry?.model?M(r.entry?.model):M(r.defaults?.model),T=M(r.defaults?.model),D=E(r.entry?.model),x=E(r.defaults?.model)||(T!=="-"?H(T):null),d=D??x??null,f=Y(r.entry?.model)??[],g=Array.isArray(r.entry?.skills)?r.entry?.skills:null,I=g?.length??null,k=!!(e.defaultId&&n.id===e.defaultId),w=!t||l||c,G=m=>{const C=f.filter((S,q)=>q!==m);h(n.id,C)},J=m=>{const C=m.target;if(m.key==="Enter"||m.key===","){m.preventDefault();const S=O(C.value);S.length>0&&(h(n.id,[...f,...S]),C.value="")}};return i`
    <section class="card">
      <div class="card-title">概览</div>
      <div class="card-sub">工作区路径与身份元数据。</div>

      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">工作区</div>
          <div>
            <button
              type="button"
              class="workspace-link mono"
              @click=${()=>A("files")}
              title="打开文件标签页"
            >${L}</button>
          </div>
        </div>
        <div class="agent-kv">
          <div class="label">主模型</div>
          <div class="mono">${F}</div>
        </div>
        <div class="agent-kv">
          <div class="label">技能筛选</div>
          <div>${g?`${I} 个已选`:"全部技能"}</div>
        </div>
      </div>

      ${v?i`
              <div class="callout warn" style="margin-top: 16px">当前有未保存的配置更改。</div>
            `:o}

      <div class="agent-model-select" style="margin-top: 20px;">
        <div class="label">模型选择</div>
        <div class="agent-model-fields">
          <label class="field">
            <span>主模型${k?"（默认）":""}</span>
            <select
              .value=${k?d??"":D??""}
              ?disabled=${w}
              @change=${m=>$(n.id,m.target.value||null)}
            >
              ${k?o:i`
                      <option value="">
                        ${x?`继承默认值（${x}）`:"继承默认值"}
                      </option>
                    `}
              ${K(t,d??void 0)}
            </select>
          </label>
          <div class="field">
            <span>备用模型</span>
            <div class="agent-chip-input" @click=${m=>{const S=m.currentTarget.querySelector("input");S&&S.focus()}}>
              ${f.map((m,C)=>i`
                  <span class="chip">
                    ${m}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${w}
                      @click=${()=>G(C)}
                    >&times;</button>
                  </span>
                `)}
              <input
                ?disabled=${w}
                placeholder=${f.length===0?"提供商/模型":""}
                @keydown=${J}
                @blur=${m=>{const C=m.target,S=O(C.value);S.length>0&&(h(n.id,[...f,...S]),C.value="")}}
              />
            </div>
          </div>
        </div>
        <div class="agent-model-actions">
          <button type="button" class="btn btn--sm" ?disabled=${l} @click=${b}>
            重新加载配置
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${c||!v}
            @click=${a}
          >
            ${c?"保存中…":"保存"}
          </button>
        </div>
      </div>
    </section>
  `}function W(e,n){return i`
    <section class="card">
      <div class="card-title">代理上下文</div>
      <div class="card-sub">${n}</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">工作区</div>
          <div class="mono">${e.workspace}</div>
        </div>
        <div class="agent-kv">
          <div class="label">主模型</div>
          <div class="mono">${e.model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">身份名称</div>
          <div>${e.identityName}</div>
        </div>
        <div class="agent-kv">
          <div class="label">身份头像</div>
          <div>${e.identityAvatar}</div>
        </div>
        <div class="agent-kv">
          <div class="label">技能筛选</div>
          <div>${e.skillsLabel}</div>
        </div>
        <div class="agent-kv">
          <div class="label">默认</div>
          <div>${e.isDefault?"是":"否"}</div>
        </div>
      </div>
    </section>
  `}function ue(e,n){const t=e.channelMeta?.find(s=>s.id===n);return t?.label?t.label:e.channelLabels?.[n]??n}function fe(e){if(!e)return[];const n=new Set;for(const l of e.channelOrder??[])n.add(l);for(const l of e.channelMeta??[])n.add(l.id);for(const l of Object.keys(e.channelAccounts??{}))n.add(l);const t=[],s=e.channelOrder?.length?e.channelOrder:Array.from(n);for(const l of s)n.has(l)&&(t.push(l),n.delete(l));for(const l of n)t.push(l);return t.map(l=>({id:l,label:ue(e,l),accounts:e.channelAccounts?.[l]??[]}))}const be=["groupPolicy","streamMode","dmPolicy"];function $e(e){let n=0,t=0,s=0;for(const l of e){const c=l.probe&&typeof l.probe=="object"&&"ok"in l.probe?!!l.probe.ok:!1;(l.connected===!0||l.running===!0||c)&&(n+=1),l.configured&&(t+=1),l.enabled&&(s+=1)}return{total:e.length,connected:n,configured:t,enabled:s}}function he(e){const n=fe(e.snapshot),t=e.lastSuccess?z(e.lastSuccess):"从未";return i`
    <section class="grid grid-cols-2">
      ${W(e.context,"工作区、身份与模型配置。")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">频道</div>
            <div class="card-sub">网关级频道状态快照。</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"刷新中…":"刷新"}
          </button>
        </div>
        <div class="muted" style="margin-top: 8px;">
          上次刷新：${t}
        </div>
        ${e.error?i`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}
        ${e.snapshot?o:i`
                <div class="callout info" style="margin-top: 12px">加载频道以查看实时状态。</div>
              `}
        ${n.length===0?i`
                <div class="muted" style="margin-top: 16px">未发现频道。</div>
              `:i`
                <div class="list" style="margin-top: 16px;">
                  ${n.map(s=>{const l=$e(s.accounts),c=l.total?`${l.connected}/${l.total} 已连接`:"无账号",v=l.configured?`${l.configured} 已配置`:"未配置",b=l.total?`${l.enabled} 已启用`:"已禁用",a=oe({configForm:e.configForm,channelId:s.id,fields:be});return i`
                      <div class="list-item">
                        <div class="list-main">
                          <div class="list-title">${s.label}</div>
                          <div class="list-sub mono">${s.id}</div>
                        </div>
                        <div class="list-meta">
                          <div>${c}</div>
                          <div>${v}</div>
                          <div>${b}</div>
                          ${l.configured===0?i`
                                  <div>
                                    <a
                                      href="https://docs.openclaw.ai/channels"
                                      target="_blank"
                                      rel="noopener"
                                      style="color: var(--accent); font-size: 12px"
                                      >配置指南</a
                                    >
                                  </div>
                                `:o}
                          ${a.length>0?a.map($=>i`<div>${$.label}: ${$.value}</div>`):o}
                        </div>
                      </div>
                    `})}
                </div>
              `}
      </section>
    </section>
  `}function ye(e){const n=e.jobs.filter(t=>t.agentId===e.agentId);return i`
    <section class="grid grid-cols-2">
      ${W(e.context,"工作区与调度目标。")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">调度器</div>
            <div class="card-sub">网关定时任务状态。</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"刷新中…":"刷新"}
          </button>
        </div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">已启用</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"是":"否":"不适用"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">任务数</div>
            <div class="stat-value">${e.status?.jobs??"不适用"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">下次唤醒</div>
            <div class="stat-value">${X(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        ${e.error?i`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}
      </section>
    </section>
    <section class="card">
      <div class="card-title">代理定时任务</div>
      <div class="card-sub">指向该代理的定时任务。</div>
      ${n.length===0?i`
              <div class="muted" style="margin-top: 16px">未分配任务。</div>
            `:i`
              <div class="list" style="margin-top: 16px;">
                ${n.map(t=>i`
                    <div class="list-item">
                      <div class="list-main">
                        <div class="list-title">${t.name}</div>
                        ${t.description?i`<div class="list-sub">${t.description}</div>`:o}
                        <div class="chip-row" style="margin-top: 6px;">
                          <span class="chip">${U(t)}</span>
                          <span class="chip ${t.enabled?"chip-ok":"chip-warn"}">
                            ${t.enabled?"已启用":"已禁用"}
                          </span>
                          <span class="chip">${t.sessionTarget}</span>
                        </div>
                      </div>
                      <div class="list-meta">
                        <div class="mono">${Z(t)}</div>
                        <div class="muted">${ee(t)}</div>
                        <button
                          class="btn btn--sm"
                          style="margin-top: 6px;"
                          ?disabled=${!t.enabled}
                          @click=${()=>e.onRunNow(t.id)}
                        >立即运行</button>
                      </div>
                    </div>
                  `)}
              </div>
            `}
    </section>
  `}function me(e){const n=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,t=n?.files??[],s=e.agentFileActive??null,l=s?t.find(a=>a.name===s)??null:null,c=s?e.agentFileContents[s]??"":"",v=s?e.agentFileDrafts[s]??c:"",b=s?v!==c:!1;return i`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">核心文件</div>
          <div class="card-sub">引导人设、身份与工具说明。</div>
        </div>
        <button
          class="btn btn--sm"
          ?disabled=${e.agentFilesLoading}
          @click=${()=>e.onLoadFiles(e.agentId)}
        >
          ${e.agentFilesLoading?"加载中…":"刷新"}
        </button>
      </div>
      ${n?i`<div class="muted mono" style="margin-top: 8px;">工作区：${n.workspace}</div>`:o}
      ${e.agentFilesError?i`<div class="callout danger" style="margin-top: 12px;">${e.agentFilesError}</div>`:o}
      ${n?i`
              <div class="agent-files-grid" style="margin-top: 16px;">
                <div class="agent-files-list">
                  ${t.length===0?i`
                          <div class="muted">未找到文件。</div>
                        `:t.map(a=>ke(a,s,()=>e.onSelectFile(a.name)))}
                </div>
                <div class="agent-files-editor">
                  ${l?i`
                          <div class="agent-file-header">
                            <div>
                              <div class="agent-file-title mono">${l.name}</div>
                              <div class="agent-file-sub mono">${l.path}</div>
                            </div>
                            <div class="agent-file-actions">
                              <button
                                class="btn btn--sm"
                                title="预览渲染后的 Markdown"
                                @click=${a=>{const h=a.currentTarget.closest(".agent-files-editor")?.querySelector("dialog");h&&h.showModal()}}
                              >
                                ${N.eye} 预览
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${!b}
                                @click=${()=>e.onFileReset(l.name)}
                              >
                                重置
                              </button>
                              <button
                                class="btn btn--sm primary"
                                ?disabled=${e.agentFileSaving||!b}
                                @click=${()=>e.onFileSave(l.name)}
                              >
                                ${e.agentFileSaving?"保存中…":"保存"}
                              </button>
                            </div>
                          </div>
                          ${l.missing?i`
                                  <div class="callout info" style="margin-top: 10px">
                                    该文件不存在。保存后将在代理工作区中创建。
                                  </div>
                                `:o}
                          <label class="field agent-file-field" style="margin-top: 12px;">
                            <span>内容</span>
                            <textarea
                              class="agent-file-textarea"
                              .value=${v}
                              @input=${a=>e.onFileDraftChange(l.name,a.target.value)}
                            ></textarea>
                          </label>
                          <dialog
                            class="md-preview-dialog"
                            @click=${a=>{const $=a.currentTarget;a.target===$&&$.close()}}
                          >
                            <div class="md-preview-dialog__panel">
                              <div class="md-preview-dialog__header">
                                <div class="md-preview-dialog__title mono">${l.name}</div>
                                <button
                                  class="btn btn--sm"
                                  @click=${a=>{a.currentTarget.closest("dialog")?.close()}}
                                >${N.x} 关闭</button>
                              </div>
                              <div class="md-preview-dialog__body sidebar-markdown">
                                ${Q(V(v))}
                              </div>
                            </div>
                          </dialog>
                        `:i`
                          <div class="muted">选择一个文件进行编辑。</div>
                        `}
                </div>
              </div>
            `:i`
              <div class="callout info" style="margin-top: 12px">
                加载代理工作区文件以编辑核心指令。
              </div>
            `}
    </section>
  `}function ke(e,n,t){const s=e.missing?"缺失":`${le(e.size)} · ${z(e.updatedAtMs??null)}`;return i`
    <button
      type="button"
      class="agent-file-row ${n===e.name?"active":""}"
      @click=${t}
    >
      <div>
        <div class="agent-file-name mono">${e.name}</div>
        <div class="agent-file-meta">${s}</div>
      </div>
      ${e.missing?i`
              <span class="agent-pill warn">缺失</span>
            `:o}
    </button>
  `}function we(e,n){const t=n.source??e.source,s=n.pluginId??e.pluginId,l=[];return t==="plugin"&&s?l.push(`plugin:${s}`):t==="core"&&l.push("核心"),n.optional&&l.push("可选"),l.length===0?o:i`
    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;">
      ${l.map(c=>i`<span class="agent-pill">${c}</span>`)}
    </div>
  `}function Ce(e){const n=p(e.configForm,e.agentId),t=n.entry?.tools??{},s=n.globalTools??{},l=t.profile??s.profile??"full",c=te(e.toolsCatalogResult),v=ne(e.toolsCatalogResult),b=t.profile?"代理覆盖":s.profile?"全局默认":"默认",a=Array.isArray(t.allow)&&t.allow.length>0,$=Array.isArray(s.allow)&&s.allow.length>0,h=!!e.configForm&&!e.configLoading&&!e.configSaving&&!a&&!(e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError),A=a?[]:Array.isArray(t.alsoAllow)?t.alsoAllow:[],r=a?[]:Array.isArray(t.deny)?t.deny:[],y=a?{allow:t.allow??[],deny:t.deny??[]}:ie(l)??void 0,L=v.flatMap(d=>d.tools.map(u=>u.id)),F=d=>{const u=se(d,y),f=B(d,A),g=B(d,r);return{allowed:(u||f)&&!g,baseAllowed:u,denied:g}},T=L.filter(d=>F(d).allowed).length,D=(d,u)=>{const f=new Set(A.map(w=>R(w)).filter(w=>w.length>0)),g=new Set(r.map(w=>R(w)).filter(w=>w.length>0)),I=F(d).baseAllowed,k=R(d);u?(g.delete(k),I||f.add(k)):(f.delete(k),g.add(k)),e.onOverridesChange(e.agentId,[...f],[...g])},x=d=>{const u=new Set(A.map(g=>R(g)).filter(g=>g.length>0)),f=new Set(r.map(g=>R(g)).filter(g=>g.length>0));for(const g of L){const I=F(g).baseAllowed,k=R(g);d?(f.delete(k),I||u.add(k)):(u.delete(k),f.add(k))}e.onOverridesChange(e.agentId,[...u],[...f])};return i`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">工具访问</div>
          <div class="card-sub">
            该代理的配置方案与工具级覆盖。
            <span class="mono">${T}/${L.length}</span> 已启用。
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" ?disabled=${!h} @click=${()=>x(!0)}>
            全部启用
          </button>
          <button class="btn btn--sm" ?disabled=${!h} @click=${()=>x(!1)}>
            全部禁用
          </button>
          <button class="btn btn--sm" ?disabled=${e.configLoading} @click=${e.onConfigReload}>
            重新加载配置
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"保存中…":"保存"}
          </button>
        </div>
      </div>

      ${e.configForm?o:i`
              <div class="callout info" style="margin-top: 12px">
                加载网关配置以调整工具配置方案。
              </div>
            `}
      ${a?i`
              <div class="callout info" style="margin-top: 12px">
                该代理在配置中使用了显式白名单。工具覆盖请在“配置”页签中管理。
              </div>
            `:o}
      ${$?i`
              <div class="callout info" style="margin-top: 12px">
                已设置全局 tools.allow。代理覆盖无法启用被全局屏蔽的工具。
              </div>
            `:o}
      ${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError?i`
              <div class="callout info" style="margin-top: 12px">正在加载运行时工具目录…</div>
            `:o}
      ${e.toolsCatalogError?i`
              <div class="callout info" style="margin-top: 12px">
                无法加载运行时工具目录，已改为显示内置后备列表。
              </div>
            `:o}

      <div class="agent-tools-meta" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">配置方案</div>
          <div class="mono">${l}</div>
        </div>
        <div class="agent-kv">
          <div class="label">来源</div>
          <div>${b}</div>
        </div>
        ${e.configDirty?i`
                <div class="agent-kv">
                  <div class="label">状态</div>
                  <div class="mono">未保存</div>
                </div>
              `:o}
      </div>

      <div class="agent-tools-presets" style="margin-top: 16px;">
        <div class="label">快捷预设</div>
        <div class="agent-tools-buttons">
          ${c.map(d=>i`
              <button
                class="btn btn--sm ${l===d.id?"active":""}"
                ?disabled=${!h}
                @click=${()=>e.onProfileChange(e.agentId,d.id,!0)}
              >
                ${d.label}
              </button>
            `)}
          <button
            class="btn btn--sm"
            ?disabled=${!h}
            @click=${()=>e.onProfileChange(e.agentId,null,!1)}
          >
            继承
          </button>
        </div>
      </div>

      <div class="agent-tools-grid" style="margin-top: 20px;">
        ${v.map(d=>i`
              <div class="agent-tools-section">
                <div class="agent-tools-header">
                  ${d.label}
                  ${d.source==="plugin"&&d.pluginId?i`<span class="agent-pill" style="margin-left: 8px;">plugin:${d.pluginId}</span>`:o}
                </div>
                <div class="agent-tools-list">
                  ${d.tools.map(u=>{const{allowed:f}=F(u.id);return i`
                      <div class="agent-tool-row">
                        <div>
                          <div class="agent-tool-title mono">${u.label}</div>
                          <div class="agent-tool-sub">${u.description}</div>
                          ${we(d,u)}
                        </div>
                        <label class="cfg-toggle">
                          <input
                            type="checkbox"
                            .checked=${f}
                            ?disabled=${!h}
                            @change=${g=>D(u.id,g.target.checked)}
                          />
                          <span class="cfg-toggle__track"></span>
                        </label>
                      </div>
                    `})}
                </div>
              </div>
            `)}
      </div>
    </section>
  `}function Se(e){const n=!!e.configForm&&!e.configLoading&&!e.configSaving,t=p(e.configForm,e.agentId),s=Array.isArray(t.entry?.skills)?t.entry?.skills:void 0,l=new Set((s??[]).map(y=>y.trim()).filter(Boolean)),c=s!==void 0,v=!!(e.report&&e.activeAgentId===e.agentId),b=v?e.report?.skills??[]:[],a=e.filter.trim().toLowerCase(),$=a?b.filter(y=>[y.name,y.description,y.source].join(" ").toLowerCase().includes(a)):b,h=de($),A=c?b.filter(y=>l.has(y.name)).length:b.length,r=b.length;return i`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">技能</div>
          <div class="card-sub">
            每代理技能白名单与工作区技能。
            ${r>0?i`<span class="mono">${A}/${r}</span>`:o}
          </div>
        </div>
        <div class="row" style="gap: 8px; flex-wrap: wrap;">
          <div class="row" style="gap: 4px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 2px;">
            <button class="btn btn--sm" ?disabled=${!n} @click=${()=>e.onClear(e.agentId)}>
              全部启用
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!n}
              @click=${()=>e.onDisableAll(e.agentId)}
            >
              全部禁用
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!n||!c}
              @click=${()=>e.onClear(e.agentId)}
              title="移除代理白名单并使用全部技能"
            >
              重置
            </button>
          </div>
          <button class="btn btn--sm" ?disabled=${e.configLoading} @click=${e.onConfigReload}>
            重新加载配置
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"加载中…":"刷新"}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"保存中…":"保存"}
          </button>
        </div>
      </div>

      ${e.configForm?o:i`
              <div class="callout info" style="margin-top: 12px">
                加载网关配置以设置代理技能。
              </div>
            `}
      ${c?i`
              <div class="callout info" style="margin-top: 12px">该代理使用了自定义技能白名单。</div>
            `:i`
              <div class="callout info" style="margin-top: 12px">
                当前已启用全部技能。禁用任一技能会创建代理白名单。
              </div>
            `}
      ${!v&&!e.loading?i`
              <div class="callout info" style="margin-top: 12px">
                加载该代理技能以查看工作区专属条目。
              </div>
            `:o}
      ${e.error?i`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>筛选</span>
          <input
            .value=${e.filter}
            @input=${y=>e.onFilterChange(y.target.value)}
            placeholder="搜索技能"
          />
        </label>
        <div class="muted">显示 ${$.length} 项</div>
      </div>

      ${$.length===0?i`
              <div class="muted" style="margin-top: 16px">未找到技能。</div>
            `:i`
              <div class="agent-skills-groups" style="margin-top: 16px;">
                ${h.map(y=>Ae(y,{agentId:e.agentId,allowSet:l,usingAllowlist:c,editable:n,onToggle:e.onToggle}))}
              </div>
            `}
    </section>
  `}function Ae(e,n){const t=e.id==="workspace"||e.id==="built-in";return i`
    <details class="agent-skills-group" ?open=${!t}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(s=>Fe(s,{agentId:n.agentId,allowSet:n.allowSet,usingAllowlist:n.usingAllowlist,editable:n.editable,onToggle:n.onToggle}))}
      </div>
    </details>
  `}function Fe(e,n){const t=n.usingAllowlist?n.allowSet.has(e.name):!0,s=ce(e),l=ge(e);return i`
    <div class="list-item agent-skill-row">
      <div class="list-main">
        <div class="list-title">${e.emoji?`${e.emoji} `:""}${e.name}</div>
        <div class="list-sub">${e.description}</div>
        ${re({skill:e})}
        ${s.length>0?i`<div class="muted" style="margin-top: 6px;">缺失：${s.join(", ")}</div>`:o}
        ${l.length>0?i`<div class="muted" style="margin-top: 6px;">原因：${l.join(", ")}</div>`:o}
      </div>
      <div class="list-meta">
        <label class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${t}
            ?disabled=${!n.editable}
            @change=${c=>n.onToggle(n.agentId,e.name,c.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </label>
      </div>
    </div>
  `}function Pe(e){const n=e.agentsList?.agents??[],t=e.agentsList?.defaultId??null,s=e.selectedAgentId??t??n[0]?.id??null,l=s?n.find(a=>a.id===s)??null:null,c=e.channels.snapshot?Object.keys(e.channels.snapshot.channelAccounts??{}).length:null,v=s?e.cron.jobs.filter(a=>a.agentId===s).length:null,b={files:e.agentFiles.list?.files?.length??null,skills:e.agentSkills.report?.skills?.length??null,channels:c,cron:v||null};return i`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          <span class="agents-toolbar-label">代理</span>
          <div class="agents-control-row">
            <div class="agents-control-select">
              <select
                class="agents-select"
                .value=${s??""}
                ?disabled=${e.loading||n.length===0}
                @change=${a=>e.onSelectAgent(a.target.value)}
              >
                ${n.length===0?i`
                        <option value="">无代理</option>
                      `:n.map(a=>i`
                        <option value=${a.id} ?selected=${a.id===s}>
                          ${ae(a)}${_(a.id,t)?` (${_(a.id,t)})`:""}
                        </option>
                      `)}
              </select>
            </div>
            <div class="agents-control-actions">
              ${l?i`
                      <div class="agent-actions-wrap">
                        <button
                          class="agent-actions-toggle"
                          type="button"
                          @click=${()=>{P=!P}}
                        >⋯</button>
                        ${P?i`
                                <div class="agent-actions-menu">
                                  <button type="button" @click=${()=>{navigator.clipboard.writeText(l.id),P=!1}}>复制代理 ID</button>
                                  <button
                                    type="button"
                                    ?disabled=${!!(t&&l.id===t)}
                                    @click=${()=>{e.onSetDefault(l.id),P=!1}}
                                  >
                                    ${t&&l.id===t?"已是默认代理":"设为默认代理"}
                                  </button>
                                </div>
                              `:o}
                      </div>
                    `:o}
              <button class="btn btn--sm agents-refresh-btn" ?disabled=${e.loading} @click=${e.onRefresh}>
                ${e.loading?"加载中…":"刷新"}
              </button>
            </div>
          </div>
        </div>
        ${e.error?i`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>`:o}
      </section>
      <section class="agents-main">
        ${l?i`
                ${xe(e.activePanel,a=>e.onSelectPanel(a),b)}
                ${e.activePanel==="overview"?ve({agent:l,basePath:e.basePath,defaultId:t,configForm:e.config.form,agentFilesList:e.agentFiles.list,agentIdentity:e.agentIdentityById[l.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange,onSelectPanel:e.onSelectPanel}):o}
                ${e.activePanel==="files"?me({agentId:l.id,agentFilesList:e.agentFiles.list,agentFilesLoading:e.agentFiles.loading,agentFilesError:e.agentFiles.error,agentFileActive:e.agentFiles.active,agentFileContents:e.agentFiles.contents,agentFileDrafts:e.agentFiles.drafts,agentFileSaving:e.agentFiles.saving,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):o}
                ${e.activePanel==="tools"?Ce({agentId:l.id,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,toolsCatalogLoading:e.toolsCatalog.loading,toolsCatalogError:e.toolsCatalog.error,toolsCatalogResult:e.toolsCatalog.result,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):o}
                ${e.activePanel==="skills"?Se({agentId:l.id,report:e.agentSkills.report,loading:e.agentSkills.loading,error:e.agentSkills.error,activeAgentId:e.agentSkills.agentId,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,filter:e.agentSkills.filter,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):o}
                ${e.activePanel==="channels"?he({context:j(l,e.config.form,e.agentFiles.list,t,e.agentIdentityById[l.id]??null),configForm:e.config.form,snapshot:e.channels.snapshot,loading:e.channels.loading,error:e.channels.error,lastSuccess:e.channels.lastSuccess,onRefresh:e.onChannelsRefresh}):o}
                ${e.activePanel==="cron"?ye({context:j(l,e.config.form,e.agentFiles.list,t,e.agentIdentityById[l.id]??null),agentId:l.id,jobs:e.cron.jobs,status:e.cron.status,loading:e.cron.loading,error:e.cron.error,onRefresh:e.onCronRefresh,onRunNow:e.onCronRunNow}):o}
              `:i`
                <div class="card">
                  <div class="card-title">选择代理</div>
                  <div class="card-sub">选择一个代理以查看其工作区和工具。</div>
                </div>
              `}
      </section>
    </div>
  `}let P=!1;function xe(e,n,t){return i`
    <div class="agent-tabs">
      ${[{id:"overview",label:"概览"},{id:"files",label:"文件"},{id:"tools",label:"工具"},{id:"skills",label:"技能"},{id:"channels",label:"频道"},{id:"cron",label:"定时任务"}].map(l=>i`
          <button
            class="agent-tab ${e===l.id?"active":""}"
            type="button"
            @click=${()=>n(l.id)}
          >
            ${l.label}${t[l.id]!=null?i`<span class="agent-tab-count">${t[l.id]}</span>`:o}
          </button>
        `)}
    </div>
  `}export{Pe as renderAgents};
//# sourceMappingURL=agents-BaF8a7Ki.js.map
