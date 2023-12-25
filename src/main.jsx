import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from './Context/AuthProvider.jsx';

const supabase = createClient(
	'https://zhvtqctsosbwvpmcfyva.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpodnRxY3Rzb3Nid3ZwbWNmeXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3MTE5NDksImV4cCI6MjAxNjI4Nzk0OX0.7HCd3B9ARTshWL0RelFa_z9fg3OGFp_2I6dtX-eXiPI'
);

ReactDOM.createRoot(document.getElementById('root')).render(
	<SessionContextProvider supabaseClient={supabase}>
		<AuthProvider>
			<Router>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</Router>
		</AuthProvider>
	</SessionContextProvider>
);
