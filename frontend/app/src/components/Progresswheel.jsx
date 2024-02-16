import styles from './Progress.module.css'

const ProgressWheel = (props) => {
    const progress = (props.currentSemester / props.totalSemesters) * 100;
    const radius = 50; // Radius of the progress wheel
    const strokeWidth = 10; // Width of the ring

    // Calculate the circumference of the circle
    const circumference = 2 * Math.PI * radius;

    // Calculate the dash offset based on the progress
    const dashOffset = circumference * (1 - progress / 100);

    // Calculate font size based on the size of the ring
    const fontSize = radius / 4;

    return (

        <div className={styles.wheelContainer}>
        <svg width={radius * 2} height={radius * 2}>
            {/* Background circle */}
            <circle
                cx={radius}
                cy={radius}
                r={radius - strokeWidth / 2}
                fill="transparent"
                stroke="#f3f3f3"
                strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <circle
                cx={radius}
                cy={radius}
                r={radius - strokeWidth / 2}
                fill="transparent"
                stroke="#20B2AA"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${radius} ${radius})`} // Rotate to start from top
            />
            {/* Text in the middle */}
            <text x={radius} y={radius} textAnchor="middle" alignmentBaseline="middle" fontSize={fontSize}>
                <tspan x={radius} dy={-fontSize / 2}>Semester</tspan>
                <tspan x={radius} dy={fontSize} fontWeight="bold">{props.currentSemester}/{props.totalSemesters}</tspan>
            </text>
        </svg>

        </div>
    );
}

export default ProgressWheel;
