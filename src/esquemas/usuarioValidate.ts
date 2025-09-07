import z from 'zod'

const usuarioEsquema = z.object({
  nombre: z.string({
    error: 'El "Nombre" es obligatorio.',
  }).min(5, { message: 'El nombre debe contener al menos 5 carácteres.' }),
  correo: z.string({
    error: 'El "Corrreo" es obligatorio.'
  }).email({ error: 'Correo electrónico inválido' }),
  contrasena: z.string({
    error: 'La "contraseña" es olbigatoria.',
  }).min(10, { message: 'La contraseña debe contener al menos 10 carácteres.' }),
  estado: z.string({
    error: 'El "Estado" es obligatorio (Activo o Baja).',
  }).min(1, { error: 'Estado obligatorio (Activo o Baja).' }),
  seguridad: z.string().array()
})

export function validateUsuario(data: any): { success: boolean; data?: any; error?: any } {
  return usuarioEsquema.safeParse(data)
};
export function validatePartialUsuario(data: any): { success: boolean; data?: any; error?: any } {
  return usuarioEsquema.partial().safeParse(data)
}