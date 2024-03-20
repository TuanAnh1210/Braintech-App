import classNames from 'classnames/bind';
import styles from './Quizz.module.scss';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [answer, setAnswer] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleClick = (q) => {
        setChoose(q.id);
        setAnswer(q);
    };

    const handleSubmit = async (question) => {
        if (question.isTrue === true) {
            toast.success('Đáp án đúng rồi', {});
            setTimeout(() => {
                navigate('/learning/111');
            }, 3000);
        } else {
            toast.error('Đáp án sai rồi');
        }
    };

    return (
        <div className={cx('quizz-container')}>
            <div className={cx('quizz-box')}>
                <h3 className={cx('quizz-heading')}>{quiz1.question}</h3>
                <ul className={cx('quizz-body')}>
                    {quiz1.answers.map((an) => (
                        <p
                            onClick={() => handleClick(an)}
                            className={cx(isChose === an.id ? 'quizz-answer-active' : 'quizz-answer')}
                        >
                            {an.name}
                        </p>
                    ))}
                </ul>
                <button onClick={() => handleSubmit(answer)} className={cx('quizz-btn')}>
                    Submit
                </button>
            </div>
            <ToastContainer theme="colored" autoClose={2000} />
        </div>
    );
};

export default Quizz;
