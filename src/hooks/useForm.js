import { useState } from 'react'

export function useForm (initialState) {
  const [form, setForm] = useState(initialState)

  const onChangeForm = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const resetForm = () => {
    setForm(initialState)
  }
  return { form, setForm, onChangeForm, resetForm }
}
