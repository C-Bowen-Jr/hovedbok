import React, { useState } from 'react'
import { createPortal } from 'react-dom'

export const PrintFrame = ({
  children,
  title,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null)
  const mountNode =
    contentRef?.contentWindow?.document?.body

  return (
    <iframe title={title} {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
      <h1>This fixes the iframe being empty</h1>
    </iframe>
  )
}
