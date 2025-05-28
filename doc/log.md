fsmLogger.js:133 🎮 GAME [12:31:52] Game store initialized
MessageSelector.jsx:8 Warning: The result of getSnapshot should be cached to avoid an infinite loop Error Component Stack
    at MessageSelector (MessageSelector.jsx:6:28)
    at div (<anonymous>)
    at div (<anonymous>)
    at App (App.jsx:12:47)
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ffdcef8a:17701
printWarning @ chunk-RC3YDMAO.js?v=ffdcef8a:521
error @ chunk-RC3YDMAO.js?v=ffdcef8a:505
mountSyncExternalStore @ chunk-RC3YDMAO.js?v=ffdcef8a:11891
useSyncExternalStore @ chunk-RC3YDMAO.js?v=ffdcef8a:12573
useSyncExternalStore @ chunk-DRWLMN53.js?v=ffdcef8a:1120
useStore @ zustand.js?v=ffdcef8a:36
useBoundStore @ zustand.js?v=ffdcef8a:46
MessageSelector @ MessageSelector.jsx:8
renderWithHooks @ chunk-RC3YDMAO.js?v=ffdcef8a:11548
mountIndeterminateComponent @ chunk-RC3YDMAO.js?v=ffdcef8a:14926
beginWork @ chunk-RC3YDMAO.js?v=ffdcef8a:15914
beginWork$1 @ chunk-RC3YDMAO.js?v=ffdcef8a:19753
performUnitOfWork @ chunk-RC3YDMAO.js?v=ffdcef8a:19198
workLoopSync @ chunk-RC3YDMAO.js?v=ffdcef8a:19137
renderRootSync @ chunk-RC3YDMAO.js?v=ffdcef8a:19116
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:18678
workLoop @ chunk-RC3YDMAO.js?v=ffdcef8a:197
flushWork @ chunk-RC3YDMAO.js?v=ffdcef8a:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=ffdcef8a:384
chunk-RC3YDMAO.js?v=ffdcef8a:19659 Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
    at checkForNestedUpdates (chunk-RC3YDMAO.js?v=ffdcef8a:19659:19)
    at scheduleUpdateOnFiber (chunk-RC3YDMAO.js?v=ffdcef8a:18533:11)
    at forceStoreRerender (chunk-RC3YDMAO.js?v=ffdcef8a:11999:13)
    at updateStoreInstance (chunk-RC3YDMAO.js?v=ffdcef8a:11975:13)
    at commitHookEffectListMount (chunk-RC3YDMAO.js?v=ffdcef8a:16915:34)
    at commitPassiveMountOnFiber (chunk-RC3YDMAO.js?v=ffdcef8a:18156:19)
    at commitPassiveMountEffects_complete (chunk-RC3YDMAO.js?v=ffdcef8a:18129:17)
    at commitPassiveMountEffects_begin (chunk-RC3YDMAO.js?v=ffdcef8a:18119:15)
    at commitPassiveMountEffects (chunk-RC3YDMAO.js?v=ffdcef8a:18109:11)
    at flushPassiveEffectsImpl (chunk-RC3YDMAO.js?v=ffdcef8a:19490:11)
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=ffdcef8a:19659
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=ffdcef8a:18533
forceStoreRerender @ chunk-RC3YDMAO.js?v=ffdcef8a:11999
updateStoreInstance @ chunk-RC3YDMAO.js?v=ffdcef8a:11975
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=ffdcef8a:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=ffdcef8a:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=ffdcef8a:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=ffdcef8a:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:19447
commitRootImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19416
commitRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:19277
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:18895
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=ffdcef8a:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:19447
(anonymous) @ chunk-RC3YDMAO.js?v=ffdcef8a:19328
workLoop @ chunk-RC3YDMAO.js?v=ffdcef8a:197
flushWork @ chunk-RC3YDMAO.js?v=ffdcef8a:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=ffdcef8a:384
hook.js:608 The above error occurred in the <MessageSelector> component:

    at MessageSelector (http://localhost:5173/src/components/Messagerie/MessageSelector.jsx?t=1748428279184:22:28)
    at div
    at div
    at App (http://localhost:5173/src/App.jsx?t=1748428279184:28:47)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ffdcef8a:17701
logCapturedError @ chunk-RC3YDMAO.js?v=ffdcef8a:14032
update.callback @ chunk-RC3YDMAO.js?v=ffdcef8a:14052
callCallback @ chunk-RC3YDMAO.js?v=ffdcef8a:11248
commitUpdateQueue @ chunk-RC3YDMAO.js?v=ffdcef8a:11265
commitLayoutEffectOnFiber @ chunk-RC3YDMAO.js?v=ffdcef8a:17093
commitLayoutMountEffects_complete @ chunk-RC3YDMAO.js?v=ffdcef8a:17980
commitLayoutEffects_begin @ chunk-RC3YDMAO.js?v=ffdcef8a:17969
commitLayoutEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:17920
commitRootImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19353
commitRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:19277
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:18895
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=ffdcef8a:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:19447
(anonymous) @ chunk-RC3YDMAO.js?v=ffdcef8a:19328
workLoop @ chunk-RC3YDMAO.js?v=ffdcef8a:197
flushWork @ chunk-RC3YDMAO.js?v=ffdcef8a:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=ffdcef8a:384
chunk-RC3YDMAO.js?v=ffdcef8a:19659 Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
    at checkForNestedUpdates (chunk-RC3YDMAO.js?v=ffdcef8a:19659:19)
    at scheduleUpdateOnFiber (chunk-RC3YDMAO.js?v=ffdcef8a:18533:11)
    at forceStoreRerender (chunk-RC3YDMAO.js?v=ffdcef8a:11999:13)
    at updateStoreInstance (chunk-RC3YDMAO.js?v=ffdcef8a:11975:13)
    at commitHookEffectListMount (chunk-RC3YDMAO.js?v=ffdcef8a:16915:34)
    at commitPassiveMountOnFiber (chunk-RC3YDMAO.js?v=ffdcef8a:18156:19)
    at commitPassiveMountEffects_complete (chunk-RC3YDMAO.js?v=ffdcef8a:18129:17)
    at commitPassiveMountEffects_begin (chunk-RC3YDMAO.js?v=ffdcef8a:18119:15)
    at commitPassiveMountEffects (chunk-RC3YDMAO.js?v=ffdcef8a:18109:11)
    at flushPassiveEffectsImpl (chunk-RC3YDMAO.js?v=ffdcef8a:19490:11)
checkForNestedUpdates @ chunk-RC3YDMAO.js?v=ffdcef8a:19659
scheduleUpdateOnFiber @ chunk-RC3YDMAO.js?v=ffdcef8a:18533
forceStoreRerender @ chunk-RC3YDMAO.js?v=ffdcef8a:11999
updateStoreInstance @ chunk-RC3YDMAO.js?v=ffdcef8a:11975
commitHookEffectListMount @ chunk-RC3YDMAO.js?v=ffdcef8a:16915
commitPassiveMountOnFiber @ chunk-RC3YDMAO.js?v=ffdcef8a:18156
commitPassiveMountEffects_complete @ chunk-RC3YDMAO.js?v=ffdcef8a:18129
commitPassiveMountEffects_begin @ chunk-RC3YDMAO.js?v=ffdcef8a:18119
commitPassiveMountEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:18109
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19490
flushPassiveEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:19447
commitRootImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19416
commitRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:19277
performSyncWorkOnRoot @ chunk-RC3YDMAO.js?v=ffdcef8a:18895
flushSyncCallbacks @ chunk-RC3YDMAO.js?v=ffdcef8a:9119
flushPassiveEffectsImpl @ chunk-RC3YDMAO.js?v=ffdcef8a:19506
flushPassiveEffects @ chunk-RC3YDMAO.js?v=ffdcef8a:19447
(anonymous) @ chunk-RC3YDMAO.js?v=ffdcef8a:19328
workLoop @ chunk-RC3YDMAO.js?v=ffdcef8a:197
flushWork @ chunk-RC3YDMAO.js?v=ffdcef8a:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=ffdcef8a:384
MultiBotManager.jsx:58 [MultiBotManager] Stopped bot processing
