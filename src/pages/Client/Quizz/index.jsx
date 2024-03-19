import classNames from 'classnames/bind';
import styles from './Quizz.module.scss';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const quiz1 = {
    question: 'Cau hoi 1',
    answers: [
        { id: 1, name: 'Cau tra loi so 1', isTrue: true },
        { id: 2, name: 'Cau tra loi so 2', isTrue: false },
        { id: 3, name: 'Cau tra loi so 3', isTrue: false },
    ],
};

const Quizz = () => {
    const [isChose, setChoose] = useState(null);
    const { id } = useParams();

    const handleClick = (id) => {
        setChoose(id);
    };

    const handleSubmit = () => {
        console.log(id);
    };
    return (
        <div className={cx('quizz-container')}>
            <div className={cx('quizz-box')}>
                <h3 className={cx('quizz-heading')}>{quiz1.question}</h3>
                <ul className={cx('quizz-body')}>
                    {quiz1.answers.map((an) => (
                        <p
                            onClick={() => handleClick(an.id, isChose)}
                            className={cx(isChose === an.id ? 'quizz-answer-active' : 'quizz-answer')}
                        >
                            {an.name}
                        </p>
                    ))}
                </ul>
                <button onClick={handleSubmit} className={cx('quizz-btn')}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Quizz;
