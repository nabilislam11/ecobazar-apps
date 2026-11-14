import AppTabs from "../../components/app-tabs";

export default function TabsLayout() {
    <Tabs>
        <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
        <Tabs.Screen name="shop/index" options={{ title: 'Shop' }} />
        <Tabs.Screen name="cart/index" options={{ title: 'Cart' }} />
        <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
    </Tabs>
    return <AppTabs />;
}