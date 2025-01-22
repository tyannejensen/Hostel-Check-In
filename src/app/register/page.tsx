export default async function Page() {
	return (
		<div>
			<h1>Register</h1>
			<form>
				<label>
					<span>Username</span>
					<input type="text" name="username" />
				</label>
				<label>
					<span>Password</span>
					<input type="password" name="password" />
				</label>
				<button type="submit">Register</button>
			</form>
		</div>
	)
}
