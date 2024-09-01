import { useState } from 'react'


export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const cleartext = () => {
    setValue('')
  }
  const inputs = {
    type,
    value,
    onChange
}

  return {
    cleartext,
    ...inputs,
  }
}
