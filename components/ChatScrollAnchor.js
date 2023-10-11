import * as React from 'react'
import { useInView } from 'react-intersection-observer'

export default function ChatScrollAnchor({ trackVisibility }) {

  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -150px 0px'
  })

  React.useEffect(() => {
    if (trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: 'start'
      })
    }
  }, [inView, entry, trackVisibility])

  return <div ref={ref} className="h-px w-full" />
}