import Login from '@/app/ui/login'
import { Suspense } from 'react';

export default async function Page() {
	return (
		<div>
			<Suspense>
				<Login/>
			</Suspense>
		</div>
	)
}
