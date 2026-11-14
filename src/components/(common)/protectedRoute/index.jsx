
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, navigation }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        );
    }

    if (!isAuthenticated) {
        navigation.replace('Login');
        return null;
    }

    return children;
}
