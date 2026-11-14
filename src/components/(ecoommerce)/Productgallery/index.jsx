
import { useEffect, useState } from 'react';

import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { API_BASE_URL } from '../../config/api';

export default function ProductGallery({
    images = [],
    name,
}) {
    const [active, setActive] = useState(0);

    // Find Main Image
    useEffect(() => {
        const mainIndex = images.findIndex(
            (image) => image?.isMain === true
        );

        setActive(mainIndex >= 0 ? mainIndex : 0);
    }, [images]);

    // Get Image URL
    const getImageUrl = (image) => {
        if (!image?.url) return null;

        const url = image.url.replace(/\\/g, '/');

        // Complete URL (Cloudinary or other)
        if (/^https?:\/\//i.test(url)) {
            return url;
        }

        // Backend relative image path
        return `${API_BASE_URL}/${url.replace(/^\/+/, '')}`;
    };

    const activeImage = getImageUrl(images[active]);

    return (
        <View style={styles.container}>

            {/* Main Image */}
            <View style={styles.mainImageContainer}>

                {activeImage ? (
                    <Image
                        source={{ uri: activeImage }}
                        style={styles.mainImage}
                        resizeMode="contain"
                        accessibilityLabel={name}
                    />
                ) : (
                    <View style={styles.placeholder} />
                )}

            </View>

            {/* Thumbnail Images */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailContainer}
            >

                {images.map((image, index) => {
                    const imageUrl = getImageUrl(image);

                    return (
                        <Pressable
                            key={image._id || index}
                            onPress={() => setActive(index)}
                            style={[
                                styles.thumbnail,
                                index === active
                                    ? styles.activeThumbnail
                                    : styles.inactiveThumbnail,
                            ]}
                        >
                            {imageUrl ? (
                                <Image
                                    source={{ uri: imageUrl }}
                                    style={styles.thumbnailImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.placeholder} />
                            )}
                        </Pressable>
                    );
                })}

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    mainImageContainer: {
        width: '100%',
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        marginBottom: 16,
    },

    mainImage: {
        width: '100%',
        height: '100%',
    },

    thumbnailContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 4,
    },

    thumbnail: {
        width: 64,
        height: 64,
        overflow: 'hidden',
        borderRadius: 6,
        borderWidth: 1.5,
    },

    activeThumbnail: {
        borderColor: '#22C55E',
    },

    inactiveThumbnail: {
        borderColor: '#F3F4F6',
    },

    thumbnailImage: {
        width: '100%',
        height: '100%',
    },

    placeholder: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
});
