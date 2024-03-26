import classNames from 'classnames/bind';
import styles from './Quizz.module.scss';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

const quiz1 = {
    question: 'Ai là thủ tướng đầu tiên của Việt Nam',
    answers: [
        { id: 1, name: 'Nguyễn Tấn Dũng', isTrue: false },
        { id: 2, name: 'Phạm Minh Chính', isTrue: false },
        { id: 3, name: 'Hồ Chí Minh', isTrue: true },
        { id: 4, name: 'Phạm Văn Đồng', isTrue: false },
    ],
};

const Quizz = () => {
    const [isChose, setChoose] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [falseAnswer, setFalseAnswer] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleClick = (q) => {
        setChoose(q.id);
        setAnswer(q);
        setFalseAnswer(null);
    };

    const handleSubmit = async (question) => {
        if (!isChose) return toast.warning('Bạn chưa chọn đáp án nào !!');
        if (question.isTrue === true) {
            toast.success('Đáp án đúng rồi, chúc mừng bạn !!', {});
        } else {
            toast.error('Đáp án sai rồi, hãy suy nghĩ lại đi :))');
            setFalseAnswer(true);
        }
    };

    return (
        <div className={cx('quizz-container')}>
            <h2 className={cx('quizz-title')}>Bài tập</h2>
            <div className={cx('quizz-box')}>
                <h3 className={cx('quizz-heading')}>{quiz1.question}</h3>
                <ul className={cx('quizz-body')}>
                    {quiz1.answers.map((an) => (
                        <p
                            key={an.id}
                            onClick={() => handleClick(an)}
                            className={cx({
                                'quizz-answer-active': isChose === an.id && !falseAnswer,
                                'quizz-answer': isChose !== an.id || falseAnswer,
                                'quizz-answer-active-false': isChose === an.id && falseAnswer === true,
                            })}
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
