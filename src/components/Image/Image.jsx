/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import classNames from 'classnames';
import { forwardRef, useState } from 'react';
import images from '@/assets/images';
import styles from './Image.module.scss';

console.log(images.noImage);

const Image = forwardRef(({ src, alt, className, fallBack: customFallback = images.noImage, ...props }, ref) => {
    const [fallBack, setFallBack] = useState();
    const handleError = () => {
        setFallBack(customFallback);
    };

    return (
        <img
            className={classNames(styles.wrapper, className)}
            ref={ref}
            {...props}
            alt={alt}
            src={fallBack || src}
            onError={handleError}
        />
    );
});

export default Image;
