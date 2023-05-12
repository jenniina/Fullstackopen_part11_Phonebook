import { useState, useImperativeHandle, forwardRef, Ref } from 'react'

interface accordionProps {
  text: string
  className: string
  children?:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
}

const Accordion = forwardRef((props: accordionProps, ref: Ref<unknown> | undefined) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <>
      <button
        className='accordionButton'
        onClick={toggleVisibility}
        style={visible ? { display: 'none' } : { display: 'inline-block' }}
      >
        {props.text}
      </button>

      <div
        className={`accordion-inner ${props.className}`}
        style={visible ? { display: 'block' } : { display: 'none' }}
      >
        {props.children}
        <button className='accordionButton' onClick={toggleVisibility}>
          close
        </button>
      </div>
    </>
  )
})

export default Accordion
