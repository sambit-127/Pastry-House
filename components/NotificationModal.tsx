import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Shadow } from 'react-native-shadow-2';


interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'cashback' | 'referral' | 'withdrawal' | 'offer' | 'info';
    amount?: string;
    status?: 'success' | 'pending' | 'failed';
}

interface Props {
    visible: boolean;
    onClose: () => void;
    notifications?: Notification[];
}

const dummyNotifications: Notification[] = [
    {
        id: '1',
        title: 'Cashback Received',
        message: 'You earned 5% cashback on your recent purchase at Amazon',
        time: '2 min ago',
        type: 'cashback',
        amount: '$12.50',
        status: 'success'
    },
    {
        id: '2',
        title: 'Referral Successful',
        message: 'Your friend John signed up using your referral link',
        time: '1 hour ago',
        type: 'referral',
        amount: '$25.00',
        status: 'success'
    },
    {
        id: '3',
        title: 'Withdrawal Processed',
        message: 'Your withdrawal of $150 has been sent to your bank account',
        time: '3 hours ago',
        type: 'withdrawal',
        amount: '$150.00',
        status: 'success'
    },
    {
        id: '4',
        title: 'Special Offer',
        message: 'Get 10% extra cashback on electronics this weekend',
        time: '5 hours ago',
        type: 'offer',
        status: 'pending'
    },
    {
        id: '5',
        title: 'Bonus Reward',
        message: 'Complete 3 more purchases to unlock premium rewards tier',
        time: '1 day ago',
        type: 'info',
        status: 'pending'
    },
    {
        id: '6',
        title: 'Referral Bonus',
        message: 'Your friend Sarah joined using your referral code',
        time: '2 days ago',
        type: 'referral',
        amount: '$25.00',
        status: 'success'
    },
    {
        id: '7',
        title: 'Cashback Processed',
        message: 'Your cashback reward has been added to your wallet',
        time: '3 days ago',
        type: 'cashback',
        amount: '$8.75',
        status: 'success'
    },
];

const NotificationModal: React.FC<Props> = ({ visible, onClose, notifications = []
    // dummyNotifications
}) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const hasNotifications = notifications.length > 0;
    const modalHeight = hasNotifications ? windowHeight : windowHeight * 0.5;
    const borderRadius = hasNotifications ? 0 : 15;

    const translateY = useSharedValue(windowHeight);
    const overlayOpacity = useSharedValue(0);




    useEffect(() => {
        if (visible) {
            // Reset values when modal becomes visible
            translateY.value = windowHeight;
            overlayOpacity.value = 0;

            // Start enter animation - slide up from bottom
            translateY.value = withSpring(0);
            overlayOpacity.value = withTiming(0.7, { duration: 300 });
        } else {
            // Reset when modal closes
            translateY.value = windowHeight;
            overlayOpacity.value = 0;
        }
    }, [visible, windowHeight]);

    const handleClose = () => {
        // Smooth translate down animation for both cases
        translateY.value = withTiming(windowHeight, { duration: 300 }, (finished) => {
            if (finished) {
                runOnJS(onClose)();
            }
        });
        overlayOpacity.value = withTiming(0, { duration: 300 });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
    }));

    // Pan gesture for swipe down (only when no notifications)
    const panGesture = Gesture.Pan()
        .enabled(!hasNotifications) // Only enable swipe for empty state
        .onUpdate((event) => {
            if (event.translationY > 0) { // Only allow swiping down
                translateY.value = event.translationY;
            }
        })
        .onEnd((event) => {
            const threshold = 100; // Minimum swipe distance to close
            if (event.translationY > threshold || event.velocityY > 500) {
                runOnJS(handleClose)();
            } else {
                translateY.value = withSpring(0, {
                    damping: 20,
                    stiffness: 90,
                });
            }
        });

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'cashback': return 'wallet';
            case 'referral': return 'person-add';
            case 'withdrawal': return 'cash';
            case 'offer': return 'pricetag';
            default: return 'notifications';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return '#4CAF50'; // Emerald green
            case 'pending': return '#F59E0B'; // Amber
            case 'failed': return '#EF4444'; // Red
            default: return '#6B7280'; // Gray
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success': return 'checkmark-circle';
            case 'pending': return 'time';
            case 'failed': return 'close-circle';
            default: return 'ellipsis-horizontal';
        }
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => (
        <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: '#2a2a2aff' } // Dark gray background for icon
                ]}>
                    <Ionicons
                        name={getNotificationIcon(item.type)}
                        size={20}
                        color="#FFFFFF" // White icon
                    />
                </View>
                <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{item.title}</Text>
                        {item.amount && (
                            <Text style={styles.amount}>
                                {item.amount}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                    <View style={styles.notificationFooter}>
                        <Text style={styles.time}>{item.time}</Text>
                        {item.status && (
                            <View style={styles.statusContainer}>
                                <Ionicons
                                    name={getStatusIcon(item.status)}
                                    size={12}
                                    color={getStatusColor(item.status)}
                                />
                                <Text style={[
                                    styles.statusText,
                                    { color: getStatusColor(item.status) }
                                ]}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );

    const renderContent = () => {
        if (hasNotifications) {
            return (
                <View style={styles.expandedContainer}>
                    <View style={styles.expandedHeader}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleClose}
                        >
                            <Ionicons name='arrow-back' size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        <View style={styles.headerPlaceholder} />
                    </View>

                    <FlatList
                        data={notifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            );
        } else {
            return (

                <Shadow startColor='#191919ff' endColor='#000000ff' offset={[0, 1]} >
                    <View style={styles.sheetContainer}>
                        <View style={styles.header}>
                            <View style={styles.handle} />
                        </View>
                        <View style={styles.emptyContent}>
                            {/* <Ionicons name="notifications-off-outline" size={64} color="#6B7280" /> */}
                            <View style={{ height: windowWidth * 0.6, width: windowWidth * 0.6 }}>
                                <LottieView
                                    autoPlay
                                    loop
                                    source={require('@/assets/animations/noNotifications.json')}
                                    style={{ height: "100%", width: "100%" }}
                                />
                            </View>
                            <Text style={styles.emptyTitle}>No notifications yet</Text>
                            <Text style={styles.emptySubtitle}>
                                When you get notifications, they'll appear here
                            </Text>
                        </View>
                    </View>
                </Shadow>
            );
        }
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={handleClose}
            transparent
            animationType="none"
        >
            <GestureHandlerRootView style={StyleSheet.absoluteFill}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={!hasNotifications ? handleClose : undefined}
                    >
                        <Animated.View
                            style={[
                                styles.overlay,
                                overlayAnimatedStyle
                            ]}
                        />
                    </TouchableOpacity>

                    {!hasNotifications ? (
                        <GestureDetector gesture={panGesture}>

                            <Animated.View
                                style={[
                                    styles.animatedView,
                                    {
                                        height: modalHeight,
                                        width: windowWidth,
                                        borderTopLeftRadius: borderRadius,
                                        borderTopRightRadius: borderRadius,
                                    },
                                    animatedStyle,
                                ]}
                            >
                                {renderContent()}
                            </Animated.View>

                        </GestureDetector>
                    ) : (

                        <Animated.View
                            style={[
                                styles.animatedView,
                                {
                                    height: modalHeight,
                                    width: windowWidth,
                                    borderTopLeftRadius: borderRadius,
                                    borderTopRightRadius: borderRadius,
                                },
                                animatedStyle,
                            ]}
                        >
                            {renderContent()}
                        </Animated.View>
                    )}
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    animatedView: {
        backgroundColor: '#000000ff', // Dark background
    },
    expandedContainer: {
        flex: 1,
        paddingTop: 50,
    },
    expandedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerPlaceholder: {
        width: 34,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sheetContainer: {
        flex: 1,
        backgroundColor: "#000",
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#4B5563',
        borderRadius: 2,
    },
    emptyContent: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#D1D5DB',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
    },
    notificationCard: {
        // backgroundColor: '#1F2937',
        backgroundColor: '#0A0A0A',
        borderWidth: 2,
        borderColor: '#1F1F1F',
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
    },
    notificationHeader: {
        flexDirection: 'row',
        flex: 1,
        borderRadius: 12
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    message: {
        fontSize: 14,
        color: '#D1D5DB',
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4CAF50', // Success green for amounts
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default NotificationModal;