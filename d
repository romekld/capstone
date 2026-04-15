[33mcommit b1b84b85d6bd6fa3ac8938e606e7f81eece18630[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;32mfeat/folder-structure[m[33m, [m[1;32mbackup/feat-before-promote-20260413-070936[m[33m)[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sun Apr 12 19:16:32 2026 +0800

    checkpoint: pre-preset-overwrite state

[33mcommit 2de0647a0c3a2eecaf530683b3425bf7ca9be104[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sun Apr 12 17:41:41 2026 +0800

    feat: wire auth + users management to Supabase; add initial docs
    
    - Added docs/architecture.md: system layers, DB schema, middleware, auth
      flows, Server Action patterns, applied migrations, key decisions
    - Added docs/changelog.md: Keep a Changelog entries from v0.1.0 through
      M4 (auth + users DB wiring)
    - Added docs/project_status.md: milestone tracker, M4 complete, M5 next steps
    - Removed .mcp.json from git tracking (credentials); added to .gitignore
    - Updated supabase/config.toml project_id to remote project ref
    - Updated pnpm-lock.yaml with @supabase/ssr and @supabase/supabase-js
    - Updated .claude/settings.json with allowed command patterns
    - Updated .codex/config.toml with Supabase MCP server config
    
    Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

[33mcommit 2b6e1fb95002e97dbb8c52ccd5bf11a8ee6f1762[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sun Apr 12 05:13:54 2026 +0800

    feat: users management ui

[33mcommit cd471f423de7297766f6e3ddfec5699a3c989894[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sun Apr 12 04:09:11 2026 +0800

    feat: users list ui

[33mcommit f3a52b337a99b3cfd21980971d151bfe663e6d70[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sun Apr 12 01:57:36 2026 +0800

    fix: faceted filter width

[33mcommit 60c381b6db0430b316cccb196662786de81fc7ec[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sat Apr 11 17:28:50 2026 +0800

    bak: before datatable

[33mcommit 7d15d30585a7472d96e9fa1bc99ebc15f604df28[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sat Apr 11 16:49:10 2026 +0800

    bak: before users lis

[33mcommit c68b9617286d68b619cc25ab258d808feddf0ba5[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sat Apr 11 10:34:48 2026 +0800

    before dashboard

[33mcommit 100cdc51a55f69a46bab9d2e07216f8af6b90ee2[m[33m ([m[1;32mfeature/nextjs-restructure[m[33m)[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sat Apr 11 08:51:14 2026 +0800

    backup: before users list

[33mcommit 72360d1ed4708166cbe96a0aca32e5747d81afbc[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Sat Apr 11 06:48:25 2026 +0800

    feat(shell): dynamic sidebar + system admin routes — M2 complete
    
    - Update apps/web submodule to feat/admin-dashboard (3a5eb71)
    - Add docs/PLANS/system-admin-dynamic-sidebar-plan.md
    - Updated docs/PLANS/changelog.md: dynamic shell data layer, proxy.ts, TeamSwitcher removal, layout RSC rewrite, NavMain leaf-item fix, admin routes
    - Updated docs/PLANS/project-status.md: M2 complete, M3 next steps defined
    - Updated docs/PLANS/architecture.md: shell data layer, proxy layer, RSC layout, data flow
    
    Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

[33mcommit 444316205bbf1dd9b4b345966aa593b1abae10d6[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Fri Apr 10 04:32:15 2026 +0800

    phase: routing

[33mcommit f0f8e73fef79ef952209d51f522554874a2e7b58[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 18:52:52 2026 +0800

    phase: infra setup v2

[33mcommit d212b419a14232c7f88b0edc64c705a648981783[m[33m ([m[1;32mbackup/main-before-promote-20260413-070936[m[33m)[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 11:48:22 2026 +0800

    feat(web): update apps/web submodule pointer after shadcn component install
    
    Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

[33mcommit fa8637234f489b77e4a86e82159a1feaa6988315[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 11:44:01 2026 +0800

    fix: nextjs structure

[33mcommit c61063bc98d842c4cd6820896ba6803ae1b2e201[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 09:26:44 2026 +0800

    backup: nextjs restructure

[33mcommit 96da39ece3e64ddf6e67e3eb7c341c4b88c6c6e0[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 08:55:51 2026 +0800

    done phase: infra setup

[33mcommit 1f136da5111612a062c94c54d2c449638216113f[m
Merge: a619d22 3b9ec77
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 06:24:18 2026 +0800

    Merge remote main into local main

[33mcommit a619d22cf42a483dede8aefd014cd22b468eea21[m
Author: rome <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 06:23:13 2026 +0800

    Initial commit

[33mcommit 3b9ec779e5c5ed8475dcc27fab2c7f4e3985c7ee[m
Author: Jerome Delos Santos <jmdelossantos@kld.edu.ph>
Date:   Thu Apr 9 06:14:55 2026 +0800

    Initial commit
