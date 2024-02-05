import styles from './RoundedImage.module.css'

const RoundedImage = ({src, alt, width}) => {
  return (
    <div className={styles.rounded_image}>
        <img className={`${styles[width]}`} 
    src={src} alt={alt} />
    </div>
  )
}

export default RoundedImage