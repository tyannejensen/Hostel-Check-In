import LoginForm from '../../ui/login-form'
import { Suspense } from 'react';

export default async function Page() {
	return (
		<div>
			<Suspense>
				<LoginForm/>
			</Suspense>
		</div>
	)
}
