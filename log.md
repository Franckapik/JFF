VM2673:1  Console Ninja extension is connected to Vite, see https://tinyurl.com/2vt8jxzw for more info.
fsmLogger.js:282 🎮 GAME [08:20:43] Game store initialized
fsmLogger.js:275 🔵 INFO [08:20:43] [shouldExplore] {context: {…}, event: {…}}
VM2673:1 The above error occurred in the <div> component:

    at div
    at Scene (http://localhost:5173/src/components/Scene.tsx?t=1751955618802:32:20)
    at Suspense
    at ErrorBoundary (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ccabe4ad:16084:5)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ccabe4ad:17704:21)
    at Provider (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ccabe4ad:17371:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
eval @ VM2673:1
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ccabe4ad:17701
logCapturedError @ chunk-Q4YQWOCV.js?v=ccabe4ad:7769
callback @ chunk-Q4YQWOCV.js?v=ccabe4ad:7815
callCallback @ chunk-Q4YQWOCV.js?v=ccabe4ad:3720
commitUpdateQueue @ chunk-Q4YQWOCV.js?v=ccabe4ad:3737
commitLayoutEffectOnFiber @ chunk-Q4YQWOCV.js?v=ccabe4ad:11070
commitLayoutMountEffects_complete @ chunk-Q4YQWOCV.js?v=ccabe4ad:12044
commitLayoutEffects_begin @ chunk-Q4YQWOCV.js?v=ccabe4ad:12033
commitLayoutEffects @ chunk-Q4YQWOCV.js?v=ccabe4ad:11984
commitRootImpl @ chunk-Q4YQWOCV.js?v=ccabe4ad:13822
commitRoot @ chunk-Q4YQWOCV.js?v=ccabe4ad:13747
finishConcurrentRender @ chunk-Q4YQWOCV.js?v=ccabe4ad:13201
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ccabe4ad:13159
workLoop @ chunk-Q4YQWOCV.js?v=ccabe4ad:278
flushWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ccabe4ad:465
chunk-Q4YQWOCV.js?v=ccabe4ad:15799 Uncaught Error: R3F: Div is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively
    at createInstance (chunk-Q4YQWOCV.js?v=ccabe4ad:15799:15)
    at completeWork (chunk-Q4YQWOCV.js?v=ccabe4ad:8418:34)
    at completeUnitOfWork (chunk-Q4YQWOCV.js?v=ccabe4ad:13694:24)
    at performUnitOfWork (chunk-Q4YQWOCV.js?v=ccabe4ad:13676:13)
    at workLoopSync (chunk-Q4YQWOCV.js?v=ccabe4ad:13608:13)
    at renderRootSync (chunk-Q4YQWOCV.js?v=ccabe4ad:13587:15)
    at recoverFromConcurrentError (chunk-Q4YQWOCV.js?v=ccabe4ad:13177:28)
    at performConcurrentWorkOnRoot (chunk-Q4YQWOCV.js?v=ccabe4ad:13125:30)
    at workLoop (chunk-Q4YQWOCV.js?v=ccabe4ad:278:42)
    at flushWork (chunk-Q4YQWOCV.js?v=ccabe4ad:257:22)
    at MessagePort.performWorkUntilDeadline (chunk-Q4YQWOCV.js?v=ccabe4ad:465:29)
createInstance @ chunk-Q4YQWOCV.js?v=ccabe4ad:15799
completeWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:8418
completeUnitOfWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:13694
performUnitOfWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:13676
workLoopSync @ chunk-Q4YQWOCV.js?v=ccabe4ad:13608
renderRootSync @ chunk-Q4YQWOCV.js?v=ccabe4ad:13587
recoverFromConcurrentError @ chunk-Q4YQWOCV.js?v=ccabe4ad:13177
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ccabe4ad:13125
workLoop @ chunk-Q4YQWOCV.js?v=ccabe4ad:278
flushWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ccabe4ad:465
chunk-Q4YQWOCV.js?v=ccabe4ad:15799 Uncaught Error: R3F: Div is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively
    at createInstance (chunk-Q4YQWOCV.js?v=ccabe4ad:15799:15)
    at completeWork (chunk-Q4YQWOCV.js?v=ccabe4ad:8418:34)
    at completeUnitOfWork (chunk-Q4YQWOCV.js?v=ccabe4ad:13694:24)
    at performUnitOfWork (chunk-Q4YQWOCV.js?v=ccabe4ad:13676:13)
    at workLoopSync (chunk-Q4YQWOCV.js?v=ccabe4ad:13608:13)
    at renderRootSync (chunk-Q4YQWOCV.js?v=ccabe4ad:13587:15)
    at recoverFromConcurrentError (chunk-Q4YQWOCV.js?v=ccabe4ad:13177:28)
    at performConcurrentWorkOnRoot (chunk-Q4YQWOCV.js?v=ccabe4ad:13125:30)
    at workLoop (chunk-Q4YQWOCV.js?v=ccabe4ad:278:42)
    at flushWork (chunk-Q4YQWOCV.js?v=ccabe4ad:257:22)
    at MessagePort.performWorkUntilDeadline (chunk-Q4YQWOCV.js?v=ccabe4ad:465:29)
createInstance @ chunk-Q4YQWOCV.js?v=ccabe4ad:15799
completeWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:8418
completeUnitOfWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:13694
performUnitOfWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:13676
workLoopSync @ chunk-Q4YQWOCV.js?v=ccabe4ad:13608
renderRootSync @ chunk-Q4YQWOCV.js?v=ccabe4ad:13587
recoverFromConcurrentError @ chunk-Q4YQWOCV.js?v=ccabe4ad:13177
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ccabe4ad:13125
workLoop @ chunk-Q4YQWOCV.js?v=ccabe4ad:278
flushWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ccabe4ad:465
VM2673:1 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ccabe4ad:17929:3)
    at FiberProvider (http://localhost:5173/node_modules/.vite/deps/chunk-Q4YQWOCV.js?v=ccabe4ad:17704:21)
    at CanvasWrapper
    at div
    at div
    at div
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
eval @ VM2673:1
overrideMethod @ hook.js:608
console.error @ chunk-Q4YQWOCV.js?v=ccabe4ad:17701
logCapturedError @ chunk-RC3YDMAO.js?v=ccabe4ad:14032
update.callback @ chunk-RC3YDMAO.js?v=ccabe4ad:14052
callCallback @ chunk-RC3YDMAO.js?v=ccabe4ad:11248
commitUpdateQueue @ chunk-RC3YDMAO.js?v=ccabe4ad:11265
commitLayoutEffectOnFiber @ chunk-RC3YDMAO.js?v=ccabe4ad:17093
commitLayoutMountEffects_complete @ chunk-RC3YDMAO.js?v=ccabe4ad:17980
commitLayoutEffects_begin @ chunk-RC3YDMAO.js?v=ccabe4ad:17969
commitLayoutEffects @ chunk-RC3YDMAO.js?v=ccabe4ad:17920
commitRootImpl @ chunk-RC3YDMAO.js?v=ccabe4ad:19353
commitRoot @ chunk-RC3YDMAO.js?v=ccabe4ad:19277
finishConcurrentRender @ chunk-RC3YDMAO.js?v=ccabe4ad:18760
performConcurrentWorkOnRoot @ chunk-RC3YDMAO.js?v=ccabe4ad:18718
workLoop @ chunk-RC3YDMAO.js?v=ccabe4ad:197
flushWork @ chunk-RC3YDMAO.js?v=ccabe4ad:176
performWorkUntilDeadline @ chunk-RC3YDMAO.js?v=ccabe4ad:384
chunk-RC3YDMAO.js?v=ccabe4ad:19413 Uncaught Error: R3F: Div is not part of the THREE namespace! Did you forget to extend? See: https://docs.pmnd.rs/react-three-fiber/api/objects#using-3rd-party-objects-declaratively
    at createInstance (chunk-Q4YQWOCV.js?v=ccabe4ad:15799:15)
    at completeWork (chunk-Q4YQWOCV.js?v=ccabe4ad:8418:34)
    at completeUnitOfWork (chunk-Q4YQWOCV.js?v=ccabe4ad:13694:24)
    at performUnitOfWork (chunk-Q4YQWOCV.js?v=ccabe4ad:13676:13)
    at workLoopSync (chunk-Q4YQWOCV.js?v=ccabe4ad:13608:13)
    at renderRootSync (chunk-Q4YQWOCV.js?v=ccabe4ad:13587:15)
    at recoverFromConcurrentError (chunk-Q4YQWOCV.js?v=ccabe4ad:13177:28)
    at performConcurrentWorkOnRoot (chunk-Q4YQWOCV.js?v=ccabe4ad:13125:30)
    at workLoop (chunk-Q4YQWOCV.js?v=ccabe4ad:278:42)
    at flushWork (chunk-Q4YQWOCV.js?v=ccabe4ad:257:22)
    at MessagePort.performWorkUntilDeadline (chunk-Q4YQWOCV.js?v=ccabe4ad:465:29)
createInstance @ chunk-Q4YQWOCV.js?v=ccabe4ad:15799
completeWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:8418
completeUnitOfWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:13694
performUnitOfWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:13676
workLoopSync @ chunk-Q4YQWOCV.js?v=ccabe4ad:13608
renderRootSync @ chunk-Q4YQWOCV.js?v=ccabe4ad:13587
recoverFromConcurrentError @ chunk-Q4YQWOCV.js?v=ccabe4ad:13177
performConcurrentWorkOnRoot @ chunk-Q4YQWOCV.js?v=ccabe4ad:13125
workLoop @ chunk-Q4YQWOCV.js?v=ccabe4ad:278
flushWork @ chunk-Q4YQWOCV.js?v=ccabe4ad:257
performWorkUntilDeadline @ chunk-Q4YQWOCV.js?v=ccabe4ad:465
chunk-4OO23XFX.js?v=ccabe4ad:17835 THREE.WebGLRenderer: Context Lost.
