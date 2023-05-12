interface loginform {
  handleSubmit: React.FormEventHandler<HTMLFormElement>
  handleUsernameChange: React.ChangeEventHandler<HTMLInputElement>
  handlePasswordChange: React.ChangeEventHandler<HTMLInputElement>
  username: string | number | readonly string[] | undefined
  password: string | number | readonly string[] | undefined
}

const FormLogin = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}: loginform) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <span>username: </span>
          <input
            name='username'
            value={username}
            placeholder='username'
            onChange={handleUsernameChange}
          />
        </label>
        <label>
          <span>password: </span>
          <input
            name='password'
            type='password'
            placeholder='password'
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default FormLogin
