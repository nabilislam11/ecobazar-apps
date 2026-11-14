
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminLogin from '../screens/admin/AdminLogin';
import AdminProtectedRoute from './AdminProtectedRoute';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AdminLogin" component={AdminLogin} />

            <Stack.Screen name="AdminDashboard">
                {() => (
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
