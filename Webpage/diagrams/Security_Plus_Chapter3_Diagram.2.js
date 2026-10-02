/* ═══════════════════════════════════════════════════════
   GRAPH VIEW — Force-directed concept map
═══════════════════════════════════════════════════════ */

/* ── Node & edge constructors ── */
function gn(id, label, color, nodeId, cx, cy) {
  return { id, label, color, nodeId: nodeId||id,
    x: cx + (Math.random()-.5)*50, y: cy + (Math.random()-.5)*50,
    vx:0, vy:0, r:18, pinned:false };
}
function ge(s, t, type, label) {
  return { s, t, type: type||'uses', label: label||'' };
}

/* ── Node definitions ── */
const GNODES = [
  // Category anchor nodes (matching THEMES)
  gn('cat-transport','Transport\nProtocols','#8b98ad',null,    0,    0),
  gn('cat-web',      'Web &\nProxies',      '#f97316',null, -360, -240),
  gn('cat-encryption','Encryption\n& TLS',  '#2ecc71',null, -200, -380),
  gn('cat-email',    'Email\nSecurity',     '#e67e22',null,  360, -300),
  gn('cat-dns',      'DNS &\nServices',     '#38bdf8',null,  100, -480),
  gn('cat-filetransfer','File\nTransfer',   '#fb923c',null, -400,  -80),
  gn('cat-remote',   'Remote\nAccess',      '#8b5cf6',null,  460,  260),
  gn('cat-voip',     'VoIP &\nReal-Time',   '#4ade80',null,  200,  480),
  gn('cat-switches', 'Switches',            '#06b6d4',null, -200,  320),
  gn('cat-routers',  'Routers',             '#3b82f6',null,  320,   80),
  gn('cat-nat',      'NAT &\nAddressing',   '#0891b2',null,  100,  200),
  gn('cat-firewalls','Firewalls',           '#ef4444',null,  580,   -80),
  gn('cat-zones',    'Network\nZones',      '#eab308',null,  400,  -200),
  gn('cat-identity', 'Identity\n& PKI',     '#a855f7',null, -360,  380),
  gn('cat-zerotrust','Zero\nTrust',         '#1abc9c',null, -460,  480),
  gn('cat-physical', 'Physical\n& OT',      '#78716c',null, -560,  100),
  // Core transport
  gn('tcp',       'TCP',           '#2ecc71','tcp',         -180,   0),
  gn('udp',       'UDP',           '#2ecc71','udp',         -180,  80),
  gn('ip',        'IP',            '#3498db','ip',          -220,  80),
  gn('icmp',      'ICMP',          '#3498db','icmp',        -280, 110),
  gn('arp',       'ARP',           '#c0865a','arp',         -240, 170),
  gn('dtransit',  'Data in\nTransit','#e74c3c','data-in-transit',-190,-40),
  // Web / encryption
  gn('http',  'HTTP',          '#e74c3c','http',   -400,-280),
  gn('https', 'HTTPS',         '#2ecc71','https',  -300,-280),
  gn('ssl',   'SSL\n(deprecated)','#95a5a6','ssl', -420,-380),
  gn('tls',   'TLS',           '#2ecc71','tls',    -300,-380),
  gn('ipsec', 'IPsec',         '#2ecc71','ipsec',  -420,-180),
  // File transfer
  gn('ftp',   'FTP',           '#e74c3c','ftp',    -360,-180),
  gn('tftp',  'TFTP',          '#e74c3c','tftp',   -440,-140),
  gn('sftp',  'SFTP',          '#2ecc71','sftp',   -280,-200),
  gn('ftps',  'FTPS',          '#2ecc71','ftps',   -360,-120),
  // Email
  gn('smtp',    'SMTP',         '#e74c3c','smtp',     340,-280),
  gn('smtsp',   'SMTSP',        '#2ecc71','smtsp',    460,-280),
  gn('pop3',    'POP3',         '#3498db','pop3',     300,-180),
  gn('imap',    'IMAP',         '#3498db','imap',     400,-180),
  gn('spf',     'SPF',          '#2ecc71','spf',      320,-380),
  gn('dkim',    'DKIM',         '#2ecc71','dkim',     440,-380),
  gn('dmarc',   'DMARC',        '#2ecc71','dmarc',    560,-320),
  gn('emailgw', 'Email\nGateway','#e67e22','email-gateway',560,-200),
  // DNS / services
  gn('dns',    'DNS',           '#3498db','dns-server', 160,-380),
  gn('dnssec', 'DNSSEC',        '#2ecc71','dns-server', 280,-380),
  gn('rrsig',  'RRSIG',         '#2ecc71','dns-server', 320,-460),
  gn('dhcp',   'DHCP',          '#3498db','dhcp',       60,-460),
  gn('ntp',    'NTP',           '#3498db','ntp',       200,-460),
  gn('ipv4',   'IPv4',          '#3498db','ipv4',      -60,-440),
  gn('ipv6',   'IPv6',          '#3498db','ipv6',      100,-520),
  gn('rfc1918','RFC 1918',      '#3498db','rfc1918',   -80,-520),
  // Switch / L2
  gn('sw',     'Switch',        '#3498db','switch',    220, 200),
  gn('vlan',   'VLAN',          '#2ecc71','vlan',      340, 240),
  gn('portsec','Port\nSecurity','#2ecc71','port-security',280,140),
  gn('macfilt','MAC\nFilter',   '#2ecc71','mac-filter', 380,160),
  gn('stp',    'STP /\nRapid STP','#2ecc71','stp',     240,320),
  gn('bpdug',  'BPDU\nGuard',   '#2ecc71','bpdu-guard',360,340),
  // Router
  gn('router', 'Router',        '#3498db','router',    340,  80),
  gn('acl',    'ACL',           '#2ecc71','acl',       460,  60),
  gn('ideny',  'Implicit\nDeny','#2ecc71','implicit-deny',480,150),
  gn('snmp12', 'SNMP\nv1/v2',   '#e74c3c','snmpv1',    520, 110),
  gn('snmp3',  'SNMP v3',       '#1abc9c','snmpv3',    520,  20),
  // Firewall / perimeter
  gn('fw',     'Firewall',      '#e67e22','firewall',  600,   0),
  gn('waf',    'WAF',           '#e67e22','waf',       700, -90),
  gn('ngfw',   'NGFW',          '#e67e22','ngfw',      700,  40),
  gn('utm',    'UTM',           '#e67e22','utm',       700, 130),
  gn('failm',  'Fail-open /\nFail-closed','#e67e22','fail-modes',600,90),
  // Zones
  gn('dmz',    'DMZ /\nScreened\nSubnet','#f1c40f','screened-subnet',520,-200),
  gn('atksurf','Attack\nSurface','#e74c3c','attack-surface',580,-310),
  gn('ca',     'CA',            '#9b59b6','ca',        500,-290),
  gn('intranet','Intranet',     '#2ecc71','intranet',  420,-200),
  gn('ew',     'East-West\nTraffic','#3498db','east-west',400,-110),
  gn('nat',    'NAT / PAT',     '#3498db','nat',       460,-110),
  // Remote access
  gn('ssh',    'SSH',           '#2ecc71','ssh',       540, 270),
  gn('openssh','OpenSSH',       '#2ecc71','openssh',   620, 230),
  gn('rdp',    'RDP',           '#e74c3c','rdp',       620, 320),
  gn('vpn',    'VPN',           '#2ecc71','vpn',       540, 380),
  gn('jump',   'Jump\nServer',  '#e67e22','jump-server',660,210),
  // VoIP
  gn('voip',   'VoIP',          '#2ecc71','voip',      200, 460),
  gn('sip',    'SIP',           '#1abc9c','sip',       120, 480),
  gn('rtp',    'RTP',           '#e74c3c','rtp',       220, 560),
  gn('srtp',   'SRTP',          '#2ecc71','srtp',      340, 480),
  // LDAP
  gn('ldap',   'LDAP',          '#e74c3c','ldap',     -220, 400),
  gn('ldaps',  'LDAPS',         '#9b59b6','ldaps',    -110, 400),
  gn('dirsvc', 'Directory\nServices','#9b59b6','directory-services',-340,400),
  // Zero Trust
  gn('ztna',   'ZTNA',          '#1abc9c','ztna',     -400, 460),
  gn('pep',    'PEP',           '#1abc9c','pep',      -300, 530),
  gn('pe',     'Policy\nEngine','#1abc9c','pe',       -440, 560),
  gn('pa',     'Policy\nAdmin', '#1abc9c','pa',       -300, 600),
  gn('ctrlpl', 'Control\nPlane','#1abc9c','control-plane',-510,520),
  gn('sase',   'SASE',          '#1abc9c','sase',     -540, 600),
  gn('adaptid','Adaptive\nIdentity','#9b59b6','adaptive-id',-430,620),
  // SCADA
  gn('scada',  'SCADA',         '#95a5a6','scada',    -520, 180),
  gn('airgap', 'Air Gap',       '#95a5a6','air-gap',  -520, 300),
  gn('physiso','Physical\nIsolation','#95a5a6','physical-isolation',-520,80),
];

/* ── Edge definitions ── */
const GEDGES = [
  // Category membership
  ge('cat-transport','tcp','member'), ge('cat-transport','udp','member'),
  ge('cat-transport','ip','member'),  ge('cat-transport','icmp','member'),
  ge('cat-transport','arp','member'), ge('cat-transport','dtransit','member'),
  ge('cat-web','http','member'),    ge('cat-web','https','member'),
  ge('cat-web','waf','member'),     ge('cat-web','emailgw','member'),
  ge('cat-web','intranet','member'),
  ge('cat-encryption','ssl','member'),  ge('cat-encryption','tls','member'),
  ge('cat-encryption','ipsec','member'),ge('cat-encryption','srtp','member'),
  ge('cat-encryption','sftp','member'), ge('cat-encryption','ftps','member'),
  ge('cat-encryption','smtsp','member'),ge('cat-encryption','ldaps','member'),
  ge('cat-email','smtp','member'),  ge('cat-email','smtsp','member'),
  ge('cat-email','pop3','member'),  ge('cat-email','imap','member'),
  ge('cat-email','spf','member'),   ge('cat-email','dkim','member'),
  ge('cat-email','dmarc','member'), ge('cat-email','emailgw','member'),
  ge('cat-dns','dns','member'),    ge('cat-dns','dnssec','member'),
  ge('cat-dns','rrsig','member'),  ge('cat-dns','dhcp','member'),
  ge('cat-dns','ntp','member'),    ge('cat-dns','snmp12','member'),
  ge('cat-dns','snmp3','member'),
  ge('cat-filetransfer','ftp','member'),  ge('cat-filetransfer','tftp','member'),
  ge('cat-filetransfer','sftp','member'), ge('cat-filetransfer','ftps','member'),
  ge('cat-remote','ssh','member'),    ge('cat-remote','openssh','member'),
  ge('cat-remote','rdp','member'),    ge('cat-remote','vpn','member'),
  ge('cat-remote','ipsec','member'),  ge('cat-remote','jump','member'),
  ge('cat-voip','voip','member'), ge('cat-voip','sip','member'),
  ge('cat-voip','rtp','member'),  ge('cat-voip','srtp','member'),
  ge('cat-switches','sw','member'),      ge('cat-switches','vlan','member'),
  ge('cat-switches','portsec','member'), ge('cat-switches','macfilt','member'),
  ge('cat-switches','stp','member'),     ge('cat-switches','bpdug','member'),
  ge('cat-switches','arp','member'),
  ge('cat-routers','router','member'), ge('cat-routers','acl','member'),
  ge('cat-routers','ideny','member'),  ge('cat-routers','snmp12','member'),
  ge('cat-routers','snmp3','member'),
  ge('cat-nat','nat','member'), ge('cat-nat','ipv4','member'),
  ge('cat-nat','ipv6','member'),ge('cat-nat','rfc1918','member'),
  ge('cat-firewalls','fw','member'),    ge('cat-firewalls','ngfw','member'),
  ge('cat-firewalls','utm','member'),   ge('cat-firewalls','waf','member'),
  ge('cat-firewalls','failm','member'), ge('cat-firewalls','dmz','member'),
  ge('cat-zones','dmz','member'),     ge('cat-zones','atksurf','member'),
  ge('cat-zones','intranet','member'),ge('cat-zones','ew','member'),
  ge('cat-zones','vlan','member'),    ge('cat-zones','ca','member'),
  ge('cat-identity','ldap','member'),  ge('cat-identity','ldaps','member'),
  ge('cat-identity','dirsvc','member'),ge('cat-identity','ca','member'),
  ge('cat-zerotrust','ztna','member'),   ge('cat-zerotrust','pep','member'),
  ge('cat-zerotrust','pe','member'),     ge('cat-zerotrust','pa','member'),
  ge('cat-zerotrust','ctrlpl','member'), ge('cat-zerotrust','sase','member'),
  ge('cat-zerotrust','adaptid','member'),
  ge('cat-physical','scada','member'), ge('cat-physical','airgap','member'),
  ge('cat-physical','physiso','member'),
  // Upgrades
  ge('http',  'https', 'upgrade','add TLS'),
  ge('ssl',   'tls',   'upgrade','deprecated'),
  ge('ftp',   'sftp',  'upgrade','use SSH'),
  ge('ftp',   'ftps',  'upgrade','add TLS'),
  ge('tftp',  'sftp',  'upgrade','use SFTP'),
  ge('smtp',  'smtsp', 'upgrade','add TLS'),
  ge('ldap',  'ldaps', 'upgrade','port 636'),
  ge('rtp',   'srtp',  'upgrade','add AES'),
  ge('snmp12','snmp3', 'upgrade','v3 only'),
  // TLS secures
  ge('tls','https','secures'), ge('tls','ftps','secures'),
  ge('tls','smtsp','secures'), ge('tls','ldaps','secures'),
  // SSH
  ge('ssh','sftp','secures'),  ge('ssh','openssh','part-of'),
  // IPsec / VPN
  ge('ipsec','vpn','secures'),
  // TCP carries
  ge('tcp','http','uses'),  ge('tcp','https','uses'), ge('tcp','ftp','uses'),
  ge('tcp','smtp','uses'),  ge('tcp','pop3','uses'),  ge('tcp','imap','uses'),
  ge('tcp','ssh','uses'),   ge('tcp','rdp','uses'),
  ge('tcp','ldap','uses'),  ge('tcp','ldaps','uses'),
  // UDP carries
  ge('udp','dns','uses'),   ge('udp','dhcp','uses'),  ge('udp','ntp','uses'),
  ge('udp','rtp','uses'),   ge('udp','srtp','uses'),  ge('udp','tftp','uses'),
  ge('udp','snmp12','uses'),ge('udp','snmp3','uses'),
  // IP / addressing
  ge('ip','ipv4','part-of'), ge('ip','ipv6','part-of'),
  ge('ipv4','rfc1918','part-of'), ge('rfc1918','nat','uses'),
  // VoIP
  ge('voip','sip','uses'), ge('voip','rtp','uses'), ge('sip','srtp','secures'),
  // LDAP / directory
  ge('ldap','dirsvc','uses'),
  // DNS security
  ge('dns','dnssec','secures'), ge('dnssec','rrsig','part-of'),
  // Email security
  ge('smtp','spf','secures'),   ge('smtp','dkim','secures'),
  ge('dkim','dmarc','part-of'), ge('spf','dmarc','part-of'),
  ge('emailgw','smtp','uses'),  ge('emailgw','dmarc','uses'),
  // Switch hardening
  ge('sw','vlan','part-of'),    ge('sw','portsec','uses'),
  ge('sw','macfilt','uses'),    ge('sw','stp','uses'),
  ge('stp','bpdug','part-of'),
  // Router hardening
  ge('router','acl','uses'),    ge('router','ideny','part-of'),
  ge('router','snmp12','uses'), ge('router','snmp3','uses'),
  // Firewall
  ge('fw','waf','part-of'),     ge('fw','ngfw','part-of'),
  ge('fw','utm','part-of'),     ge('fw','failm','part-of'),
  ge('fw','dmz','secures'),     ge('waf','https','secures'),
  ge('ngfw','acl','uses'),
  // Zones
  ge('dmz','ca','uses'),
  // Zero Trust
  ge('ztna','pep','uses'),
  ge('pep','pe','part-of'),     ge('pep','pa','part-of'),
  ge('pe','ctrlpl','part-of'),  ge('pa','ctrlpl','part-of'),
  ge('sase','ztna','uses'),     ge('adaptid','pep','uses'),
  // SCADA
  ge('scada','airgap','uses'),  ge('airgap','physiso','part-of'),
  // Remote access hardening
  ge('jump','ssh','uses'),      ge('vpn','rdp','secures'),
  // Attack paths
  ge('atksurf','http',  'attacks','sniff'),
  ge('atksurf','ftp',   'attacks','steal creds'),
  ge('atksurf','rdp',   'attacks','brute force'),
  ge('atksurf','ldap',  'attacks','cleartext bind'),
  ge('atksurf','snmp12','attacks','community string'),
  ge('atksurf','dns',   'attacks','DNS poison'),
];

/* ── Simulation constants ── */
const G_REPEL    = 20000;
const G_SPRING   = 0.035;
const G_IDEAL    = 130;
const G_GRAVITY  = 0.004;
const G_DAMPING  = 0.80;

/* ── State ── */
let gNodes = [], gNodeMap = {}, gGraphInited = false, gGraphActive = false;
let gDragNode = null, gDragOff = {};
let gPanning = false, gPanStart = {};
let gTx = { x: 0, y: 0, k: 1 };

/* ── Force tick ── */
function gTick() {
  const ns = gNodes;
  for (let i = 0; i < ns.length; i++) {
    const a = ns[i]; if (a.pinned) continue;
    for (let j = i+1; j < ns.length; j++) {
      const b = ns[j];
      let dx = b.x-a.x, dy = b.y-a.y;
      const d2 = dx*dx + dy*dy + 1, d = Math.sqrt(d2);
      const f = G_REPEL / d2, fx = f*dx/d, fy = f*dy/d;
      a.vx -= fx; a.vy -= fy;
      if (!b.pinned) { b.vx += fx; b.vy += fy; }
    }
  }
  for (const e of GEDGES) {
    const a = gNodeMap[e.s], b = gNodeMap[e.t];
    if (!a||!b) continue;
    const dx = b.x-a.x, dy = b.y-a.y;
    const d = Math.sqrt(dx*dx+dy*dy)+0.001;
    const f = G_SPRING*(d-G_IDEAL);
    const fx = f*dx/d, fy = f*dy/d;
    if (!a.pinned){a.vx+=fx;a.vy+=fy;}
    if (!b.pinned){b.vx-=fx;b.vy-=fy;}
  }
  for (const n of ns) {
    if (n.pinned) continue;
    n.vx += -n.x*G_GRAVITY; n.vy += -n.y*G_GRAVITY;
    n.vx *= G_DAMPING; n.vy *= G_DAMPING;
    n.x  += n.vx;     n.y  += n.vy;
  }
}

function runGraphLayout(steps) {
  gNodes.forEach(n => { n.pinned=false; n.vx=0; n.vy=0; });
  for (let i=0; i<steps; i++) gTick();
  gRender();
}

/* ── Edge styles ── */
const GESTYLE = {
  osi:     { color:'#1e3a5f', w:1,   dash:'3,8',  mk:null },
  uses:    { color:'#222c44', w:1.5, dash:'',      mk:'ga-gray' },
  'part-of':{ color:'#2d4060', w:1,  dash:'4,4',   mk:'ga-gray' },
  upgrade: { color:'#3498db', w:2,   dash:'',      mk:'ga-blue' },
  secures: { color:'#2ecc71', w:1.5, dash:'',      mk:'ga-green' },
  attacks: { color:'#e74c3c', w:1.5, dash:'5,3',   mk:'ga-red' },
};

/* ── Render to SVG ── */
function gRender() {
  const svgGe = document.getElementById('ge');
  const svgGn = document.getElementById('gn');
  svgGe.innerHTML = ''; svgGn.innerHTML = '';
  const ns = document.createElementNS;

  function el(tag, attrs) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
    return e;
  }

  // Edges
  for (const e of GEDGES) {
    const a = gNodeMap[e.s], b = gNodeMap[e.t];
    if (!a||!b) continue;
    const st = GESTYLE[e.type] || GESTYLE.uses;
    const dx = b.x-a.x, dy = b.y-a.y, d = Math.sqrt(dx*dx+dy*dy)+0.001;
    const sr = a.r+2, er = b.r+(st.mk?9:2);
    const x1=a.x+dx/d*sr, y1=a.y+dy/d*sr, x2=b.x-dx/d*er, y2=b.y-dy/d*er;

    const line = el('line',{x1,y1,x2,y2,stroke:st.color,'stroke-width':st.w,
      opacity: e.type==='osi'?'0.35':'0.7',
      'data-gs': e.s, 'data-gt': e.t});
    if (st.dash) line.setAttribute('stroke-dasharray',st.dash);
    if (st.mk)   line.setAttribute('marker-end',`url(#${st.mk})`);
    svgGe.appendChild(line);

    if (e.label && (e.type==='upgrade'||e.type==='attacks')) {
      const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
      const t = el('text',{x:mx,y:my-4,'text-anchor':'middle',
        'font-size':'8','font-family':'Segoe UI,system-ui,sans-serif',
        'font-weight':'600',fill:st.color,opacity:'0.85','pointer-events':'none'});
      t.textContent = e.label;
      svgGe.appendChild(t);
    }
  }

  // Nodes
  for (const n of gNodes) {
    const isCat = n.id.startsWith('cat-');
    const g = el('g',{ transform:`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`, cursor:'pointer', 'data-g-node-id': n.id });

    const circle = el('circle',{ r:n.r, fill:n.color+'22', stroke:n.color,
      'stroke-width': isCat ? '2.5' : '1.5' });
    g.appendChild(circle);

    const lines = n.label.split('\n');
    const lh = 11, sy = -(lines.length-1)*lh/2;
    lines.forEach((lbl,i) => {
      const t = el('text',{ 'text-anchor':'middle', 'dominant-baseline':'middle',
        y: sy + i*lh, 'font-size': n.r>26?'10':'9',
        'font-family':'Segoe UI,system-ui,sans-serif',
        'font-weight':'700', fill:n.color, 'pointer-events':'none' });
      t.textContent = lbl;
      g.appendChild(t);
    });

    g.addEventListener('mouseenter', () => {
      circle.setAttribute('fill', n.color+'44');
      circle.setAttribute('stroke-width','2.5');
    });
    g.addEventListener('mouseleave', () => {
      if (gDragNode!==n) {
        circle.setAttribute('fill', n.color+'22');
        circle.setAttribute('stroke-width', isCat?'2.5':'1.5');
      }
    });
    g.addEventListener('mousedown', ev => {
      ev.stopPropagation();
      gDragNode = n; n.pinned = true;
      const pt = gSvgPt(ev);
      gDragOff = { x:pt.x-n.x, y:pt.y-n.y };
    });
    g.addEventListener('click', ev => {
      ev.stopPropagation();
      if (!n.nodeId) return;
      const d = NODE_DATA[n.nodeId];
      if (selectedNode) selectedNode.classList.remove('selected');
      selectedNode = null;
      if (d) openDetail(n.nodeId, d.title, d.osi, d.html);
    });
    svgGn.appendChild(g);
  }
  gApplyTx();
  if (activeThemeFilter) applyThemeFilter(activeThemeFilter);
}

/* ── Zoom / Pan ── */
function gSvgPt(e) {
  const r = document.getElementById('graph-svg').getBoundingClientRect();
  return { x:(e.clientX-r.left-gTx.x)/gTx.k, y:(e.clientY-r.top-gTx.y)/gTx.k };
}
function gApplyTx() {
  document.getElementById('graph-root').setAttribute('transform',
    `translate(${gTx.x.toFixed(1)},${gTx.y.toFixed(1)}) scale(${gTx.k.toFixed(4)})`);
}
function fitGraph() {
  if (!gNodes.length) return;
  const svg = document.getElementById('graph-svg');
  const { width:W, height:H } = svg.getBoundingClientRect();
  let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
  gNodes.forEach(n => { mnx=Math.min(mnx,n.x-n.r); mxx=Math.max(mxx,n.x+n.r);
                         mny=Math.min(mny,n.y-n.r); mxy=Math.max(mxy,n.y+n.r); });
  const pad=50, k=Math.min((W-pad*2)/(mxx-mnx),(H-pad*2)/(mxy-mny),1.8);
  gTx.k=k; gTx.x=W/2-(mnx+mxx)/2*k; gTx.y=H/2-(mny+mxy)/2*k;
  gApplyTx();
}

function gSetupInteraction() {
  const svg = document.getElementById('graph-svg');
  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const r=svg.getBoundingClientRect(), mx=e.clientX-r.left, my=e.clientY-r.top;
    const f=e.deltaY<0?1.12:0.89;
    gTx.x=mx-(mx-gTx.x)*f; gTx.y=my-(my-gTx.y)*f;
    gTx.k=Math.max(0.12,Math.min(4, gTx.k*f));
    gApplyTx();
  },{passive:false});
  svg.addEventListener('mousedown', e => {
    const tgt = e.target;
    if (tgt===svg||tgt.id==='graph-root'||tgt.id==='ge'||tgt.id==='gn') {
      gPanning=true;
      gPanStart={x:e.clientX-gTx.x, y:e.clientY-gTx.y};
    }
  });
  window.addEventListener('mousemove', e => {
    if (gDragNode) {
      const pt=gSvgPt(e);
      gDragNode.x=pt.x-gDragOff.x; gDragNode.y=pt.y-gDragOff.y;
      gRender();
    } else if (gPanning) {
      gTx.x=e.clientX-gPanStart.x; gTx.y=e.clientY-gPanStart.y;
      gApplyTx();
    }
  });
  window.addEventListener('mouseup', () => {
    gDragNode=null; gPanning=false;
  });
}

/* ═══════════════════════════════════════════════════════
   TOPIC THEMES — definitions & node membership
═══════════════════════════════════════════════════════ */

const THEMES = [
  { id:'firewalls',    label:'Firewalls',             color:'#ef4444',
    desc:'Firewall · NGFW · UTM · WAF · Fail modes · Screened Subnet',
    nodes:['firewall','ngfw','utm','waf','fail-modes','screened-subnet','dmz-zone'] },

  { id:'routers',      label:'Routers',               color:'#3b82f6',
    desc:'Router · ACL · Implicit Deny · IP · ICMP · Routing logic',
    nodes:['router','acl','implicit-deny','ip','icmp'] },

  { id:'switches',     label:'Switches',              color:'#06b6d4',
    desc:'Switch · VLAN · Port Security · MAC Filter · STP · BPDU Guard',
    nodes:['switch','vlan','port-security','mac-filter','stp','bpdu-guard','arp'] },

  { id:'nat',          label:'NAT & IP Addressing',   color:'#0891b2',
    desc:'NAT · PAT · Static NAT · Dynamic NAT · IPv4 · IPv6 · RFC 1918',
    nodes:['nat','nat-gateway','pat','static-nat','dynamic-nat',
           'ipv4','ipv6','rfc1918','unicast'] },

  { id:'transport',    label:'Transport Protocols',   color:'#8b98ad',
    desc:'TCP · UDP · IP · ICMP — core L3/L4 protocols',
    nodes:['tcp','udp','ip','icmp','arp'] },

  { id:'encryption',   label:'Encryption & TLS',      color:'#2ecc71',
    desc:'SSL · TLS · IPsec · SRTP · HTTPS · SMTSP · LDAPS · SFTP · FTPS',
    nodes:['ssl','tls','ipsec','srtp','https','smtsp','ldaps','sftp','ftps','data-in-transit'] },

  { id:'web',          label:'Web & Proxies',         color:'#f97316',
    desc:'HTTP · HTTPS · Web Server · Proxy · Forward Proxy · Reverse Proxy · WAF',
    nodes:['http','https','web-server','proxy','forward-proxy','reverse-proxy','waf','ssl','tls'] },

  { id:'email',        label:'Email Security',        color:'#e67e22',
    desc:'SMTP · SMTSP · POP3 · IMAP · SPF · DKIM · DMARC · Gateway',
    nodes:['mail-server','smtp','smtsp','pop3','imap','spf','dkim','dmarc','email-gateway'] },

  { id:'remote',       label:'Remote Access',         color:'#8b5cf6',
    desc:'SSH · OpenSSH · RDP · VPN · IPsec · Jump Server',
    nodes:['ssh','openssh','rdp','vpn','ipsec','jump-server'] },

  { id:'filetransfer', label:'File Transfer',         color:'#fb923c',
    desc:'FTP · TFTP · SFTP · FTPS — insecure vs secure pairs',
    nodes:['ftp','tftp','sftp','ftps'] },

  { id:'voip',         label:'VoIP & Real-Time',      color:'#4ade80',
    desc:'VoIP · SIP · RTP · SRTP · Session signaling',
    nodes:['voip','sip','rtp','srtp'] },

  { id:'dns',          label:'DNS & Network Services',color:'#38bdf8',
    desc:'DNS · DHCP · NTP · SNMP v1 · SNMP v3',
    nodes:['dns-server','dhcp','ntp','snmpv1','snmpv3'] },

  { id:'zones',        label:'Network Zones',         color:'#eab308',
    desc:'DMZ · Screened Subnet · Intranet · Extranet · Attack Surface · East-West',
    nodes:['dmz-zone','screened-subnet','intranet','extranet','attack-surface','east-west','vlan'] },

  { id:'zerotrust',    label:'Zero Trust',            color:'#1abc9c',
    desc:'ZTNA · PEP · PE · PA · Control Plane · SASE · Adaptive Identity',
    nodes:['ztna','pep','pe','pa','control-plane','data-plane',
           'adaptive-id','sase','implicit-trust','subject','resource'] },

  { id:'identity',     label:'Identity & PKI',        color:'#a855f7',
    desc:'LDAP · LDAPS · Directory Services · CA · Adaptive Identity',
    nodes:['ldap','ldaps','directory-services','ca','adaptive-id'] },

  { id:'physical',     label:'Physical & OT Security',color:'#78716c',
    desc:'SCADA · Air Gap · Air-Gapped System · Physical Isolation',
    nodes:['scada','air-gap','air-gapped-system','physical-isolation'] },
];

/* Map: nodeDataId → array of theme ids it belongs to */
const NODE_THEME_MAP = {};
THEMES.forEach(t => {
  t.nodes.forEach(nid => {
    if (!NODE_THEME_MAP[nid]) NODE_THEME_MAP[nid] = [];
    NODE_THEME_MAP[nid].push(t.id);
  });
});

/* Map: graph node id → array of theme ids (via nodeId lookup) */
// Used later in applyThemeFilter for the graph view

/* ── Build theme buttons in sidebar ── */
(function buildThemePanel() {
  const panel = document.getElementById('sidebar-themes');
  THEMES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'theme-btn';
    btn.dataset.themeId = t.id;
    btn.style.color = t.color;
    btn.title = t.desc;
    btn.innerHTML =
      `<span class="theme-dot" style="background:${t.color};border-color:${t.color}"></span>` +
      `<span>${t.label}</span>`;
    btn.addEventListener('click', () => {
      if (activeThemeFilter === t.id) clearThemeFilter();
      else applyThemeFilter(t.id);
    });
    panel.appendChild(btn);
  });
})();

/* ═══════════════════════════════════════════════════════
   THEME FILTER LOGIC
═══════════════════════════════════════════════════════ */
let activeThemeFilter = null;

function applyThemeFilter(themeId) {
  activeThemeFilter = themeId;
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;
  const matchSet = new Set(theme.nodes);

  /* ── Topology canvas ── */
  document.querySelectorAll('.node[data-node-id]').forEach(node => {
    const id = node.dataset.nodeId;
    node.classList.remove('theme-match', 'theme-dim');
    if (matchSet.has(id)) {
      node.classList.add('theme-match');
      // Tint the matching node's border to the theme colour
      node.style.setProperty('--theme-color', theme.color);
    } else {
      node.classList.add('theme-dim');
      node.style.removeProperty('--theme-color');
    }
  });

  /* Dim zones whose every node is outside the theme */
  document.querySelectorAll('.zone').forEach(zone => {
    const nodes = zone.querySelectorAll('.node[data-node-id]');
    const allDim = [...nodes].every(n => n.classList.contains('theme-dim'));
    zone.classList.toggle('zone-all-dim', allDim && nodes.length > 0);
  });

  document.body.classList.add('theme-filtered');

  /* ── Theme buttons ── */
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeId === themeId);
  });

  /* ── Graph view ── */
  if (gGraphActive && gGraphInited) {
    const gMatchSet = new Set();
    GNODES.forEach(n => {
      if (n.id.startsWith('cat-')) { gMatchSet.add(n.id); return; }
      const themes = NODE_THEME_MAP[n.nodeId] || [];
      if (themes.includes(themeId)) gMatchSet.add(n.id);
    });
    document.querySelectorAll('#gn > g[data-g-node-id]').forEach(g => {
      const nid = g.dataset.gNodeId;
      g.style.opacity = gMatchSet.has(nid) ? '1' : '0.06';
      g.style.pointerEvents = gMatchSet.has(nid) ? 'auto' : 'none';
    });
    document.querySelectorAll('#ge > line[data-gs][data-gt]').forEach(line => {
      const s = line.dataset.gs, t2 = line.dataset.gt;
      line.style.opacity = (gMatchSet.has(s) && gMatchSet.has(t2)) ? '0.65' : '0.05';
    });
  }

  /* ── Filter banner ── */
  _updateThemeBanner(theme);
}

function clearThemeFilter() {
  activeThemeFilter = null;

  document.querySelectorAll('.node').forEach(n => {
    n.classList.remove('theme-match', 'theme-dim');
    n.style.removeProperty('--theme-color');
  });
  document.querySelectorAll('.zone').forEach(z => z.classList.remove('zone-all-dim'));
  document.body.classList.remove('theme-filtered');

  document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));

  if (gGraphActive && gGraphInited) {
    document.querySelectorAll('#gn > g').forEach(g => {
      g.style.opacity = '1'; g.style.pointerEvents = 'auto';
    });
    document.querySelectorAll('#ge > line').forEach(l => l.style.opacity = '');
  }

  _updateThemeBanner(null);
}

function _updateThemeBanner(theme) {
  let banner = document.getElementById('theme-filter-banner');
  if (!theme) { if (banner) banner.remove(); return; }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'theme-filter-banner';
    banner.style.cssText = [
      'position:absolute','bottom:0','left:0','right:0',
      'background:rgba(15,23,42,0.92)','border-top:1px solid var(--border)',
      'padding:5px 6px','font-size:9px','font-weight:700',
      'color:var(--text-dim)','text-align:center','letter-spacing:0.4px',
      'z-index:60','cursor:pointer','line-height:1.5'
    ].join(';');
    banner.title = 'Click to clear filter';
    banner.onclick = clearThemeFilter;
    document.getElementById('osi-sidebar').appendChild(banner);
  }
  banner.innerHTML =
    `<span style="color:${theme.color}">${theme.label}</span><br>` +
    `<span style="opacity:0.55">click to clear</span>`;
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR TAB SWITCHER
═══════════════════════════════════════════════════════ */
function switchSidebarTab(tab) {
  /* Update tab buttons */
  document.querySelectorAll('.sb-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));

  /* Show/hide panels */
  const osiPanel    = document.getElementById('sidebar-osi');
  const themePanel  = document.getElementById('sidebar-themes');
  osiPanel.style.display   = tab === 'osi'    ? 'flex' : 'none';
  themePanel.style.display = tab === 'themes' ? 'flex' : 'none';

  /* Clear whichever filter belongs to the panel we're leaving */
  if (tab === 'osi'    && activeThemeFilter) clearThemeFilter();
  if (tab === 'themes' && activeOsiFilter)   clearOsiFilter();
}


/* ═══════════════════════════════════════════════════════
   ILLUSTRATED MODE — emoji cards + edge descriptions
═══════════════════════════════════════════════════════ */
let illustratedMode = false;

/* Emoji icon for each graph node id */
const GICONS = {
  l7:'📱', l6:'🔐', l5:'🤝', l4:'📦', l3:'🌐', l2:'🔗', l1:'⚡',
  tcp:'🔁', udp:'💨', ip:'🌍', icmp:'📨', arp:'🔍', dtransit:'🔄',
  http:'🌐', https:'🔒', ssl:'⚠️', tls:'🛡', ipsec:'🔐',
  ftp:'📂', tftp:'⚡', sftp:'🗝', ftps:'📁',
  smtp:'✉', smtsp:'📧', pop3:'📬', imap:'📥',
  spf:'✅', dkim:'🔏', dmarc:'📋', emailgw:'🚦',
  dns:'📡', dnssec:'🛡', rrsig:'📜', dhcp:'🏠', ntp:'⏰',
  ipv4:'4️', ipv6:'6️', rfc1918:'🏘',
  sw:'🔀', vlan:'🏷', portsec:'🔒', macfilt:'🎭', stp:'🌳', bpdug:'🛡',
  router:'🔄', acl:'📋', ideny:'🚫', snmp12:'⚠', snmp3:'✅',
  fw:'🧱', waf:'🔰', ngfw:'🛡', utm:'🏰', failm:'⚡',
  dmz:'🏴', atksurf:'🎯', ca:'🏛', intranet:'🏢', ew:'↔', nat:'🔁',
  ssh:'💻', openssh:'🔑', rdp:'🖥', vpn:'🔒', jump:'🚪',
  voip:'📞', sip:'📱', rtp:'🎵', srtp:'🎶',
  ldap:'📒', ldaps:'🔒', dirsvc:'🗂',
  ztna:'◎', pep:'🚦', pe:'🧠', pa:'👔', ctrlpl:'⚙', sase:'☁', adaptid:'🎭',
  scada:'🏭', airgap:'✂', physiso:'🔒',
};

/* Per-edge descriptions explaining the connection */
const GEDGE_DESC = {
  /* OSI layer membership */
  'l7->http':'HTTP lives at\nApp Layer','l7->https':'HTTPS lives at\nApp Layer',
  'l7->ftp':'FTP lives at\nApp Layer','l7->sftp':'SFTP lives at\nApp Layer',
  'l7->ftps':'FTPS lives at\nApp Layer','l7->smtp':'SMTP lives at\nApp Layer',
  'l7->smtsp':'SMTSP lives at\nApp Layer','l7->pop3':'POP3 lives at\nApp Layer',
  'l7->imap':'IMAP lives at\nApp Layer','l7->dns':'DNS lives at\nApp Layer',
  'l7->dhcp':'DHCP lives at\nApp Layer','l7->ntp':'NTP lives at\nApp Layer',
  'l7->ssh':'SSH lives at\nApp Layer','l7->rdp':'RDP lives at\nApp Layer',
  'l7->snmp3':'SNMPv3 lives at\nApp Layer','l7->ldap':'LDAP lives at\nApp Layer',
  'l7->ldaps':'LDAPS lives at\nApp Layer','l7->voip':'VoIP lives at\nApp Layer',
  'l7->emailgw':'Email GW lives at\nApp Layer',
  'l6->ssl':'SSL operates at\nPresentation','l6->tls':'TLS operates at\nPresentation',
  'l5->sip':'SIP sets up\nSessions','l4->tcp':'TCP is the\nTransport protocol',
  'l4->udp':'UDP is the\nTransport protocol','l4->rtp':'RTP runs on\nTransport layer',
  'l4->srtp':'SRTP runs on\nTransport layer','l3->ip':'IP routes at\nNetwork layer',
  'l3->icmp':'ICMP operates at\nNetwork layer','l3->arp':'ARP bridges\nL2 and L3',
  'l3->router':'Routers operate\nat Network layer','l3->ipsec':'IPsec secures\nIP packets',
  'l3->nat':'NAT operates at\nNetwork layer','l2->sw':'Switches operate\nat Data Link',
  'l2->vlan':'VLANs segment\nData Link layer','l2->stp':'STP prevents\nL2 loops',
  'l1->airgap':'Air gap enforces\nPhysical separation','l1->physiso':'Physical isolation\nat Layer 1',
  'l1->scada':'SCADA has\nPhysical components',
  /* Upgrades */
  'http->https':'Add TLS to\nencrypt traffic','ssl->tls':'TLS replaces\ndeprecated SSL',
  'ftp->sftp':'SFTP encrypts\nvia SSH tunnel','ftp->ftps':'FTPS adds\nTLS to FTP',
  'tftp->sftp':'Use SFTP instead\n(no auth in TFTP)','smtp->smtsp':'Add TLS to\nencrypt email',
  'ldap->ldaps':'Add TLS on\nport 636','rtp->srtp':'Add AES to\nencrypt media',
  'snmp12->snmp3':'SNMPv3 adds\nauth + encryption',
  /* TLS secures */
  'tls->https':'TLS provides\nHTTPS encryption','tls->ftps':'TLS encrypts\nFTP session',
  'tls->smtsp':'TLS encrypts\nSMTP session','tls->ldaps':'TLS encrypts\nLDAP bind',
  /* SSH */
  'ssh->sftp':'SFTP is SSH\nfile transfer','ssh->openssh':'OpenSSH is the\nSSH implementation',
  /* IPsec */
  'ipsec->vpn':'IPsec creates\nencrypted VPN tunnels',
  /* TCP carries */
  'tcp->http':'HTTP uses TCP\nport 80','tcp->https':'HTTPS uses TCP\nport 443',
  'tcp->ftp':'FTP uses TCP\nports 20/21','tcp->smtp':'SMTP uses TCP\nport 25',
  'tcp->pop3':'POP3 uses TCP\nport 110','tcp->imap':'IMAP uses TCP\nport 143',
  'tcp->ssh':'SSH uses TCP\nport 22','tcp->rdp':'RDP uses TCP\nport 3389',
  'tcp->ldap':'LDAP uses TCP\nport 389','tcp->ldaps':'LDAPS uses TCP\nport 636',
  /* UDP carries */
  'udp->dns':'DNS uses UDP\nport 53','udp->dhcp':'DHCP uses UDP\nports 67/68',
  'udp->ntp':'NTP uses UDP\nport 123','udp->rtp':'RTP uses UDP\nfor low latency',
  'udp->srtp':'SRTP uses UDP\n(encrypted RTP)','udp->tftp':'TFTP uses UDP\nport 69',
  'udp->snmp12':'SNMPv1/2 uses UDP\nport 161','udp->snmp3':'SNMPv3 uses UDP\nport 161',
  /* IP / addressing */
  'ip->ipv4':'IPv4 is the\nmain IP version','ip->ipv6':'IPv6 succeeds\nIPv4',
  'ipv4->rfc1918':'RFC 1918 defines\nprivate IPv4 ranges','rfc1918->nat':'Private IPs need\nNAT to reach internet',
  /* VoIP */
  'voip->sip':'SIP sets up\nVoIP sessions','voip->rtp':'RTP carries\nVoIP media',
  'sip->srtp':'SRTP secures\nSIP media streams',
  /* LDAP */
  'ldap->dirsvc':'LDAP is the\ndirectory protocol',
  /* DNS */
  'dns->dnssec':'DNSSEC signs\nDNS responses','dnssec->rrsig':'RRSIG is the\nDNSSEC signature record',
  /* Email security */
  'smtp->spf':'SPF validates\nSMTP sender IP','smtp->dkim':'DKIM signs\nSMTP messages',
  'dkim->dmarc':'DMARC builds on\nDKIM + SPF','spf->dmarc':'DMARC requires\nSPF pass',
  'emailgw->smtp':'Gateway relays\nvia SMTP','emailgw->dmarc':'Gateway enforces\nDMARC policy',
  /* Switch hardening */
  'sw->vlan':'VLANs segment\nswitch ports','sw->portsec':'Port security limits\nMAC addresses per port',
  'sw->macfilt':'MAC filtering controls\nwhich devices connect','sw->stp':'STP prevents\nbroadcast storms',
  'stp->bpdug':'BPDU Guard stops\nunauthorized STP claims',
  /* Router hardening */
  'router->acl':'ACLs filter\nrouter traffic','router->ideny':'Implicit deny\nblocks unlisted traffic',
  'router->snmp12':'SNMP monitors\nrouter stats','router->snmp3':'SNMPv3 securely\nmonitors router',
  /* Firewall */
  'fw->waf':'WAF is a specialized\nweb firewall','fw->ngfw':'NGFW extends\nstateful inspection',
  'fw->utm':'UTM bundles\nmultiple security tools','fw->failm':'Fail modes define\nbehavior on crash',
  'fw->dmz':'Firewall controls\nDMZ traffic','waf->https':'WAF inspects\nHTTPS traffic',
  'ngfw->acl':'NGFW uses ACLs\nfor traffic policy',
  /* Zones */
  'dmz->ca':'CA lives in DMZ\nfor external cert issuance',
  /* Zero Trust */
  'ztna->pep':'PEP enforces\nZTNA policies',
  'pep->pe':'Policy Engine makes\naccess decisions',
  'pep->pa':'Policy Admin configures\nPEP behavior',
  'pe->ctrlpl':'Policy Engine lives\nin the Control Plane',
  'pa->ctrlpl':'Policy Admin manages\nthe Control Plane',
  'sase->ztna':'SASE delivers\nZTNA as a cloud service',
  'adaptid->pep':'Adaptive Identity\nfeeds risk signals to PEP',
  /* SCADA */
  'scada->airgap':'Air gaps isolate\nSCADA from networks',
  'airgap->physiso':'Air gap is a form\nof physical isolation',
  /* Remote */
  'jump->ssh':'Jump server connects\nvia SSH','vpn->rdp':'VPN tunnels protect\nRDP sessions',
  /* Attack paths */
  'atksurf->http':'Attacker sniffs\nunencrypted HTTP',
  'atksurf->ftp':'Attacker steals\nFTP credentials',
  'atksurf->rdp':'Attacker brute-forces\nRDP login',
  'atksurf->ldap':'Attacker binds\nLDAP without TLS',
  'atksurf->snmp12':'Attacker reads\ncommunity strings',
  'atksurf->dns':'Attacker poisons\nDNS cache',
};

function getEdgeDesc(e) {
  return GEDGE_DESC[`${e.s}->${e.t}`] || e.label || null;
}

/* Patch gRender to support illustrated mode */
const _origGRender = gRender;
gRender = function() {
  if (!illustratedMode) { _origGRender(); return; }

  const svgGe = document.getElementById('ge');
  const svgGn = document.getElementById('gn');
  svgGe.innerHTML = ''; svgGn.innerHTML = '';

  function el(tag, attrs) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k,v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  }

  // Edges with description labels
  for (const e of GEDGES) {
    const a = gNodeMap[e.s], b = gNodeMap[e.t];
    if (!a || !b) continue;
    const st = GESTYLE[e.type] || GESTYLE.uses;
    const dx = b.x-a.x, dy = b.y-a.y, d = Math.sqrt(dx*dx+dy*dy)+0.001;
    const nw = 48, nh = 44;
    const sr = Math.sqrt((nw/2)**2+(nh/2)**2)+2;
    const er = sr + (st.mk ? 9 : 2);
    const x1 = a.x+dx/d*sr, y1 = a.y+dy/d*sr;
    const x2 = b.x-dx/d*er, y2 = b.y-dy/d*er;

    const line = el('line', {x1,y1,x2,y2, stroke:st.color, 'stroke-width':st.w,
      opacity: e.type==='osi'?'0.3':'0.7', 'data-gs':e.s, 'data-gt':e.t});
    if (st.dash) line.setAttribute('stroke-dasharray', st.dash);
    if (st.mk)   line.setAttribute('marker-end', `url(#${st.mk})`);
    svgGe.appendChild(line);

    const desc = getEdgeDesc(e);
    if (desc && e.type !== 'osi') {
      const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
      const lines = desc.split('\n');
      const bw = 72, bh = lines.length * 10 + 6;
      const bg = el('rect', {x:mx-bw/2, y:my-bh/2, width:bw, height:bh,
        rx:'3', fill:'#07090f', stroke:st.color, 'stroke-width':'0.5', opacity:'0.92'});
      svgGe.appendChild(bg);
      lines.forEach((ln, i) => {
        const t = el('text', {x:mx, y: my - (lines.length-1)*5 + i*10,
          'text-anchor':'middle', 'dominant-baseline':'middle',
          'font-size':'7.5', 'font-family':'Segoe UI,system-ui,sans-serif',
          'font-weight':'600', fill:st.color, 'pointer-events':'none'});
        t.textContent = ln;
        svgGe.appendChild(t);
      });
    }
  }

  // Nodes as emoji cards
  const NW = 68, NH = 56;
  for (const n of gNodes) {
    const isAnchor = n.id.startsWith('cat-');
    const g = el('g', {transform:`translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`,
      cursor:'pointer', 'data-g-node-id':n.id});

    const rect = el('rect', {x:-NW/2, y:-NH/2, width:NW, height:NH, rx:'8',
      fill:n.color+'18', stroke:n.color, 'stroke-width': isAnchor?'2.5':'1.5'});
    g.appendChild(rect);

    const icon = el('text', {y:'-6', 'text-anchor':'middle', 'dominant-baseline':'middle',
      'font-size': isAnchor?'20':'16', 'pointer-events':'none'});
    icon.textContent = GICONS[n.id] || '●';
    g.appendChild(icon);

    const lbl = el('text', {y:'14', 'text-anchor':'middle', 'dominant-baseline':'middle',
      'font-size':'7.5', 'font-family':'Segoe UI,system-ui,sans-serif',
      'font-weight':'700', fill:n.color, 'pointer-events':'none'});
    lbl.textContent = n.label.replace(/\n/g,' ');
    g.appendChild(lbl);

    g.addEventListener('mouseenter', () => rect.setAttribute('fill', n.color+'35'));
    g.addEventListener('mouseleave', () => { if(gDragNode!==n) rect.setAttribute('fill', n.color+'18'); });
    g.addEventListener('mousedown', ev => {
      ev.stopPropagation(); gDragNode = n; n.pinned = true;
      const pt = gSvgPt(ev); gDragOff = {x:pt.x-n.x, y:pt.y-n.y};
    });
    g.addEventListener('click', ev => {
      ev.stopPropagation();
      const layerMatch = n.id.match(/^l([1-7])$/);
      if (layerMatch) { selectOsiLayer(parseInt(layerMatch[1])); return; }
      const d = NODE_DATA[n.nodeId];
      if (selectedNode) selectedNode.classList.remove('selected');
      selectedNode = null;
      if (d) openDetail(n.nodeId, d.title, d.osi, d.html);
    });
    svgGn.appendChild(g);
  }
  gApplyTx();
  if (activeOsiFilter) applyOsiFilter(activeOsiFilter);
};

function toggleIllustrated() {
  if (!gGraphActive) toggleGraphView();
  illustratedMode = !illustratedMode;
  const btn = document.getElementById('btn-illustrated');
  btn.style.cssText = illustratedMode
    ? 'border-color:var(--purple);color:var(--purple);background:rgba(155,89,182,.12)'
    : '';
  btn.textContent = illustratedMode ? '🖼 Bubble View' : '🖼 Illustrated';
  gRender();
}

/* ── Toggle ── */
function toggleGraphView() {
  gGraphActive = !gGraphActive;
  const btn    = document.getElementById('btn-graph');
  const gview  = document.getElementById('graph-view');
  const canvas = document.getElementById('canvas');
  if (gGraphActive) {
    btn.style.cssText='border-color:var(--teal);color:var(--teal);background:rgba(26,188,156,0.1)';
    gview.classList.add('visible');
    canvas.style.display='none';
    if (!gGraphInited) {
      gNodes    = GNODES.map(n=>({...n}));
      gNodeMap  = {};
      gNodes.forEach(n=>gNodeMap[n.id]=n);
      // degree-based radius
      const deg={};
      gNodes.forEach(n=>deg[n.id]=0);
      GEDGES.forEach(e=>{ if(deg[e.s]!==undefined)deg[e.s]++; if(deg[e.t]!==undefined)deg[e.t]++;});
      gNodes.forEach(n=>{
        n.r = n.id.startsWith('cat-') ? 36 : Math.max(18,Math.min(34,18+((deg[n.id]||0)*1.4)));
      });
      runGraphLayout(280);
      gSetupInteraction();
      gGraphInited=true;
    }
    setTimeout(fitGraph,60);
  } else {
    btn.style.cssText='';
    gview.classList.remove('visible');
    canvas.style.display='';
  }
}
