import{d as a,A as v,f as y,L as w,M as $}from"./index-CenotFkT.js";function k(e){const s=e?.agents??{},l=Array.isArray(s.list)?s.list:[],t=[];return l.forEach((i,o)=>{if(!i||typeof i!="object")return;const n=i,d=typeof n.id=="string"?n.id.trim():"";if(!d)return;const u=typeof n.name=="string"?n.name.trim():void 0,r=n.default===!0;t.push({id:d,name:u||void 0,isDefault:r,index:o,record:n})}),t}function S(e,s){const l=new Set(s),t=[];for(const i of e){if(!(Array.isArray(i.commands)?i.commands:[]).some(r=>l.has(String(r))))continue;const d=typeof i.nodeId=="string"?i.nodeId.trim():"";if(!d)continue;const u=typeof i.displayName=="string"&&i.displayName.trim()?i.displayName.trim():d;t.push({id:d,label:u===d?d:`${u} · ${d}`})}return t.sort((i,o)=>i.label.localeCompare(o.label)),t}const g="__defaults__",_=[{value:"deny",label:"拒绝"},{value:"allowlist",label:"允许列表"},{value:"full",label:"完全允许"}],D=[{value:"off",label:"关闭"},{value:"on-miss",label:"未命中时"},{value:"always",label:"始终询问"}];function mapLabel(e,s,l){const t=e.find(i=>i.value===s)?.label;return t??l}function geLabel(e){return mapLabel(_,e,e)}function askLabel(e){return mapLabel(D,e,e)}function toggleLabel(e){return e?"开":"关"}function h(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function N(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function E(e){const s=e?.defaults??{};return{security:h(s.security),ask:N(s.ask),askFallback:h(s.askFallback??"deny"),autoAllowSkills:!!(s.autoAllowSkills??!1)}}function L(e){return k(e).map(s=>({id:s.id,name:s.name,isDefault:s.isDefault}))}function I(e,s){const l=L(e),t=Object.keys(s?.agents??{}),i=new Map;l.forEach(n=>i.set(n.id,n)),t.forEach(n=>{i.has(n)||i.set(n,{id:n})});const o=Array.from(i.values());return o.length===0&&o.push({id:"main",isDefault:!0}),o.sort((n,d)=>{if(n.isDefault&&!d.isDefault)return-1;if(!n.isDefault&&d.isDefault)return 1;const u=n.name?.trim()?n.name:n.id,r=d.name?.trim()?d.name:d.id;return u.localeCompare(r)}),o}function P(e,s){return e===g?g:e&&s.some(l=>l.id===e)?e:g}function R(e){const s=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,l=!!s,t=E(s),i=I(e.configForm,s),o=M(e.nodes),n=e.execApprovalsTarget;let d=n==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;n==="node"&&d&&!o.some(f=>f.id===d)&&(d=null);const u=P(e.execApprovalsSelectedAgent,i),r=u!==g?(s?.agents??{})[u]??null:null,m=Array.isArray(r?.allowlist)?r.allowlist??[]:[];return{ready:l,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:s,defaults:t,selectedScope:u,selectedAgent:r,agents:i,allowlist:m,target:n,targetNodeId:d,targetNodes:o,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function B(e){const s=e.ready,l=e.target!=="node"||!!e.targetNodeId;return a`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">执行审批</div>
          <div class="card-sub">
            用于 <span class="mono">exec host=gateway/node</span> 的允许列表与审批策略。
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.dirty||!l}
          @click=${e.onSave}
        >
          ${e.saving?"保存中…":"保存"}
        </button>
      </div>

      ${T(e)}

      ${s?a`
            ${F(e)}
            ${C(e)}
            ${e.selectedScope===g?v:U(e)}
          `:a`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">先加载执行审批配置，才能编辑允许列表。</div>
            <button class="btn" ?disabled=${e.loading||!l} @click=${e.onLoad}>
              ${e.loading?"加载中…":"加载审批配置"}
            </button>
          </div>`}
    </section>
  `}function T(e){const s=e.targetNodes.length>0,l=e.targetNodeId??"";return a`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">目标</div>
          <div class="list-sub">
            网关用于编辑本地审批；节点用于编辑所选节点的审批配置。
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>主机</span>
            <select
              ?disabled=${e.disabled}
              @change=${t=>{if(t.target.value==="node"){const n=e.targetNodes[0]?.id??null;e.onSelectTarget("node",l||n)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>网关</option>
              <option value="node" ?selected=${e.target==="node"}>节点</option>
            </select>
          </label>
          ${e.target==="node"?a`
                <label class="field">
                  <span>节点</span>
                  <select
                    ?disabled=${e.disabled||!s}
                    @change=${t=>{const o=t.target.value.trim();e.onSelectTarget("node",o||null)}}
                  >
                    <option value="" ?selected=${l===""}>选择节点</option>
                    ${e.targetNodes.map(t=>a`<option
                          value=${t.id}
                          ?selected=${l===t.id}
                        >
                          ${t.label}
                        </option>`)}
                  </select>
                </label>
              `:v}
        </div>
      </div>
      ${e.target==="node"&&!s?a`
              <div class="muted">当前还没有节点声明执行审批能力。</div>
            `:v}
    </div>
  `}function F(e){return a`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">作用范围</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===g?"active":""}"
          @click=${()=>e.onSelectScope(g)}
        >
          默认项
        </button>
        ${e.agents.map(s=>{const l=s.name?.trim()?`${s.name} (${s.id})`:s.id;return a`
            <button
              class="btn btn--sm ${e.selectedScope===s.id?"active":""}"
              @click=${()=>e.onSelectScope(s.id)}
            >
              ${l}
            </button>
          `})}
      </div>
    </div>
  `}function C(e){const s=e.selectedScope===g,l=e.defaults,t=e.selectedAgent??{},i=s?["defaults"]:["agents",e.selectedScope],o=typeof t.security=="string"?t.security:void 0,n=typeof t.ask=="string"?t.ask:void 0,d=typeof t.askFallback=="string"?t.askFallback:void 0,u=s?l.security:o??"__default__",r=s?l.ask:n??"__default__",m=s?l.askFallback:d??"__default__",f=typeof t.autoAllowSkills=="boolean"?t.autoAllowSkills:void 0,A=f??l.autoAllowSkills,x=f==null;return a`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">安全策略</div>
          <div class="list-sub">
            ${s?"默认安全模式。":`默认：${geLabel(l.security)}。`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>模式</span>
            <select
              ?disabled=${e.disabled}
              @change=${c=>{const p=c.target.value;!s&&p==="__default__"?e.onRemove([...i,"security"]):e.onPatch([...i,"security"],p)}}
            >
              ${s?v:a`<option value="__default__" ?selected=${u==="__default__"}>
                    使用默认值（${geLabel(l.security)}）
                  </option>`}
              ${_.map(c=>a`<option
                    value=${c.value}
                    ?selected=${u===c.value}
                  >
                    ${c.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">询问策略</div>
          <div class="list-sub">
            ${s?"默认提示策略。":`默认：${askLabel(l.ask)}。`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>模式</span>
            <select
              ?disabled=${e.disabled}
              @change=${c=>{const p=c.target.value;!s&&p==="__default__"?e.onRemove([...i,"ask"]):e.onPatch([...i,"ask"],p)}}
            >
              ${s?v:a`<option value="__default__" ?selected=${r==="__default__"}>
                    使用默认值（${askLabel(l.ask)}）
                  </option>`}
              ${D.map(c=>a`<option
                    value=${c.value}
                    ?selected=${r===c.value}
                  >
                    ${c.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">询问回退策略</div>
          <div class="list-sub">
            ${s?"当界面无法显示审批提示时应用该策略。":`默认：${geLabel(l.askFallback)}。`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>回退策略</span>
            <select
              ?disabled=${e.disabled}
              @change=${c=>{const p=c.target.value;!s&&p==="__default__"?e.onRemove([...i,"askFallback"]):e.onPatch([...i,"askFallback"],p)}}
            >
              ${s?v:a`<option value="__default__" ?selected=${m==="__default__"}>
                    使用默认值（${geLabel(l.askFallback)}）
                  </option>`}
              ${_.map(c=>a`<option
                    value=${c.value}
                    ?selected=${m===c.value}
                  >
                    ${c.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">自动允许技能 CLI</div>
          <div class="list-sub">
            ${s?"允许网关已登记的技能可执行文件。":x?`使用默认值（${toggleLabel(l.autoAllowSkills)}）。`:`已覆盖（${toggleLabel(A)}）。`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>启用</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${A}
              @change=${c=>{const b=c.target;e.onPatch([...i,"autoAllowSkills"],b.checked)}}
            />
          </label>
          ${!s&&!x?a`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,"autoAllowSkills"])}
              >
                使用默认值
              </button>`:v}
        </div>
      </div>
    </div>
  `}function U(e){const s=["agents",e.selectedScope,"allowlist"],l=e.allowlist;return a`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">允许列表</div>
        <div class="card-sub">不区分大小写的通配模式。</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{const t=[...l,{pattern:""}];e.onPatch(s,t)}}
      >
        添加模式
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${l.length===0?a`
              <div class="muted">当前还没有允许列表条目。</div>
            `:l.map((t,i)=>j(e,t,i))}
    </div>
  `}function j(e,s,l){const t=s.lastUsedAt?y(s.lastUsedAt):"从未使用",i=s.lastUsedCommand?w(s.lastUsedCommand,120):null,o=s.lastResolvedPath?w(s.lastResolvedPath,120):null;return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s.pattern?.trim()?s.pattern:"新模式"}</div>
        <div class="list-sub">最近使用：${t}</div>
        ${i?a`<div class="list-sub mono">${i}</div>`:v}
        ${o?a`<div class="list-sub mono">${o}</div>`:v}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>模式</span>
          <input
            type="text"
            .value=${s.pattern??""}
            ?disabled=${e.disabled}
            @input=${n=>{const d=n.target;e.onPatch(["agents",e.selectedScope,"allowlist",l,"pattern"],d.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove(["agents",e.selectedScope,"allowlist"]);return}e.onRemove(["agents",e.selectedScope,"allowlist",l])}}
        >
          删除
        </button>
      </div>
    </div>
  `}function M(e){return S(e,["system.execApprovals.get","system.execApprovals.set"])}function Z(e){const s=H(e),l=R(e);return a`
    ${B(l)}
    ${K(s)}
    ${O(e)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">节点</div>
          <div class="card-sub">已配对设备与实时连接。</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"加载中…":"刷新"}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${e.nodes.length===0?a`
                <div class="muted">未找到节点。</div>
              `:e.nodes.map(t=>Q(t))}
      </div>
    </section>
  `}function O(e){const s=e.devicesList??{pending:[],paired:[]},l=Array.isArray(s.pending)?s.pending:[],t=Array.isArray(s.paired)?s.paired:[];return a`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">设备</div>
          <div class="card-sub">配对请求与角色令牌。</div>
        </div>
        <button class="btn" ?disabled=${e.devicesLoading} @click=${e.onDevicesRefresh}>
          ${e.devicesLoading?"加载中…":"刷新"}
        </button>
      </div>
      ${e.devicesError?a`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:v}
      <div class="list" style="margin-top: 16px;">
        ${l.length>0?a`
              <div class="muted" style="margin-bottom: 8px;">待处理</div>
              ${l.map(i=>V(i,e))}
            `:v}
        ${t.length>0?a`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">已配对</div>
              ${t.map(i=>G(i,e))}
            `:v}
        ${l.length===0&&t.length===0?a`
                <div class="muted">暂无已配对设备。</div>
              `:v}
      </div>
    </section>
  `}function V(e,s){const l=e.displayName?.trim()||e.deviceId,t=typeof e.ts=="number"?y(e.ts):"n/a",i=e.role?.trim()?`role: ${e.role}`:"role: -",o=e.isRepair?" · repair":"",n=e.remoteIp?` · ${e.remoteIp}`:"";return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${l}</div>
        <div class="list-sub">${e.deviceId}${n}</div>
        <div class="muted" style="margin-top: 6px;">
          ${i} · 请求于 ${t}${o}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>s.onDeviceApprove(e.requestId)}>
            批准
          </button>
          <button class="btn btn--sm" @click=${()=>s.onDeviceReject(e.requestId)}>
            拒绝
          </button>
        </div>
      </div>
    </div>
  `}function G(e,s){const l=e.displayName?.trim()||e.deviceId,t=e.remoteIp?` · ${e.remoteIp}`:"",i=`roles: ${$(e.roles)}`,o=`scopes: ${$(e.scopes)}`,n=Array.isArray(e.tokens)?e.tokens:[];return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${l}</div>
        <div class="list-sub">${e.deviceId}${t}</div>
        <div class="muted" style="margin-top: 6px;">${i} · ${o}</div>
        ${n.length===0?a`
                <div class="muted" style="margin-top: 6px">令牌：无</div>
              `:a`
              <div class="muted" style="margin-top: 10px;">令牌</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${n.map(d=>z(e.deviceId,d,s))}
              </div>
            `}
      </div>
    </div>
  `}function z(e,s,l){const t=s.revokedAtMs?"revoked":"active",i=`scopes: ${$(s.scopes)}`,o=y(s.rotatedAtMs??s.createdAtMs??s.lastUsedAtMs??null);return a`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${s.role} · ${t} · ${i} · ${o}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>l.onDeviceRotate(e,s.role,s.scopes)}
        >
          轮换
        </button>
        ${s.revokedAtMs?v:a`
              <button
                class="btn btn--sm danger"
                @click=${()=>l.onDeviceRevoke(e,s.role)}
              >
                撤销
              </button>
            `}
      </div>
    </div>
  `}function H(e){const s=e.configForm,l=Y(e.nodes),{defaultBinding:t,agents:i}=J(s),o=!!s,n=e.configSaving||e.configFormMode==="raw";return{ready:o,disabled:n,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:t,agents:i,nodes:l,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function K(e){const s=e.nodes.length>0,l=e.defaultBinding??"";return a`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">执行节点绑定</div>
          <div class="card-sub">
            当使用 <span class="mono">exec host=node</span> 时，将代理固定到指定节点。
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.configDirty}
          @click=${e.onSave}
        >
          ${e.configSaving?"保存中…":"保存"}
        </button>
      </div>

      ${e.formMode==="raw"?a`
              <div class="callout warn" style="margin-top: 12px">
                请先将“配置”页切换到<strong>表单</strong>模式，再在这里编辑绑定。
              </div>
            `:v}

      ${e.ready?a`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">默认绑定</div>
                  <div class="list-sub">当代理未覆盖节点绑定时使用。</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>节点</span>
                    <select
                      ?disabled=${e.disabled||!s}
                      @change=${t=>{const o=t.target.value.trim();e.onBindDefault(o||null)}}
                    >
                      <option value="" ?selected=${l===""}>任意节点</option>
                      ${e.nodes.map(t=>a`<option
                            value=${t.id}
                            ?selected=${l===t.id}
                          >
                            ${t.label}
                          </option>`)}
                    </select>
                  </label>
                  ${s?v:a`
                          <div class="muted">当前没有提供 system.run 的节点。</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?a`
                      <div class="muted">未找到代理。</div>
                    `:e.agents.map(t=>X(t,e))}
            </div>
          `:a`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">先加载配置，才能编辑绑定。</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"加载中…":"加载配置"}
            </button>
          </div>`}
    </section>
  `}function X(e,s){const l=e.binding??"__default__",t=e.name?.trim()?`${e.name} (${e.id})`:e.id,i=s.nodes.length>0;return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t}</div>
        <div class="list-sub">
          ${e.isDefault?"默认代理":"代理"} ·
          ${l==="__default__"?`使用默认值（${s.defaultBinding??"任意"}）`:`覆盖：${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>绑定</span>
          <select
            ?disabled=${s.disabled||!i}
            @change=${o=>{const d=o.target.value.trim();s.onBindAgent(e.index,d==="__default__"?null:d)}}
          >
            <option value="__default__" ?selected=${l==="__default__"}>
              使用默认值
            </option>
            ${s.nodes.map(o=>a`<option
                  value=${o.id}
                  ?selected=${l===o.id}
                >
                  ${o.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function Y(e){return S(e,["system.run"])}function J(e){const s={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[s]};const t=(e.tools??{}).exec??{},i=typeof t.node=="string"&&t.node.trim()?t.node.trim():null,o=e.agents??{};if(!Array.isArray(o.list)||o.list.length===0)return{defaultBinding:i,agents:[s]};const n=k(e).map(d=>{const r=(d.record.tools??{}).exec??{},m=typeof r.node=="string"&&r.node.trim()?r.node.trim():null;return{id:d.id,name:d.name,index:d.index,isDefault:d.isDefault,binding:m}});return n.length===0&&n.push(s),{defaultBinding:i,agents:n}}function Q(e){const s=!!e.connected,l=!!e.paired,t=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),i=Array.isArray(e.caps)?e.caps:[],o=Array.isArray(e.commands)?e.commands:[];return a`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t}</div>
        <div class="list-sub">
          ${typeof e.nodeId=="string"?e.nodeId:""}
          ${typeof e.remoteIp=="string"?` · ${e.remoteIp}`:""}
          ${typeof e.version=="string"?` · ${e.version}`:""}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${l?"已配对":"未配对"}</span>
          <span class="chip ${s?"chip-ok":"chip-warn"}">
            ${s?"已连接":"离线"}
          </span>
          ${i.slice(0,12).map(n=>a`<span class="chip">${String(n)}</span>`)}
          ${o.slice(0,8).map(n=>a`<span class="chip">${String(n)}</span>`)}
        </div>
      </div>
    </div>
  `}export{Z as renderNodes};
//# sourceMappingURL=nodes-Bel0FC94.js.map
