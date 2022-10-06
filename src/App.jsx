import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const [price, setPrice] = useState(3300000);
  const [contribution, setСontribution] = useState(420000);
  const [percent, setPercent] = useState(13);
  const [lease, setLease] = useState(60);
  const [loading, setLoading] = useState(false);
  const [successSend, setSuccessSend] = useState(null);
  const [errorSend, setErrorSend] = useState(null);

  const [monthPay, setMonthPay] = useState(0);
  const [sumTreaty, setSumTreaty] = useState(0);

  const handleMonthPay = () =>
    setMonthPay(
      Math.round(
        ((price - contribution) *
          ((percent / 100) * Math.pow(1 + percent / 100, lease))) /
          Math.pow(1 + percent / 100, lease - 1)
      )
    );

  const handleSumTreaty = () => {
    setSumTreaty(Math.round((contribution + lease) * monthPay));
  };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      price,
      contribution,
      percent,
      lease,
      monthPay,
      sumTreaty,
    }),
  };
  const handleSendData = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch("https://hookb.in/eK160jgYJ6UlaRPldJ1P", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setSuccessSend(data.success);
        setErrorSend(null);
        setLoading(false);
      })
      .catch((err) => {
        setErrorSend(err.message);
        setSuccessSend(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    setСontribution((percent / 100) * price);
    handleMonthPay();
    handleSumTreaty();
  }, [percent]);
  console.log(isNaN(price));

  return (
    <div className="wrapper">
      <form className="c" onSubmit={handleSendData}>
        <h1 className="c-title">Рассчитайте стоимость автомобиля в лизинг</h1>
        <div className="c-calc">
          <div className="c-calc-price">
            <h5>Стоимость автомобиля</h5>
            <input
              type="text"
              disabled={loading}
              value={price.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}
              onChange={(event) => {
                if (Number(event.target.value) > 6000000 || isNaN(price)) {
                  setPrice(6000000);
                } else if (
                  Number(event.target.value) < 1000000 ||
                  isNaN(price)
                ) {
                  setPrice(1000000);
                } else {
                  setPrice(Number(event.target.value));
                }
                handleMonthPay();
                handleSumTreaty();
              }}
              min="1000000"
              max="6000000"
            />
            <label htmlFor="price">&#8381;</label>
            <input
              type="range"
              disabled={loading}
              min={1000000}
              max={6000000}
              step={500000}
              value={price}
              onChange={(event) => {
                setPrice(event.target.value);
                handleMonthPay();
                handleSumTreaty();
              }}
            />
          </div>
          <div className="c-calc-price">
            <h5>Первоначальный взнос</h5>
            <input
              id="percent"
              type="text"
              disabled={loading}
              value={contribution
                .toString()
                .replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}
              onChange={(event) => {
                if (
                  Number(event.target.value) > 1980000 ||
                  percent > 198 ||
                  isNaN(contribution) ||
                  isNaN(percent)
                ) {
                  setСontribution(1980000);
                  setPercent(198);
                } else if (
                  Number(event.target.value) > 100000 ||
                  percent > 10 ||
                  isNaN(contribution) ||
                  isNaN(percent)
                ) {
                  setPercent(10);
                  setСontribution(100000);
                } else {
                  setСontribution(Math.round(Number(event.target.value)));
                  setPercent(Number((contribution / price) * 100));
                }

                handleMonthPay();
                handleSumTreaty();
              }}
            />
            <label htmlFor="percent">{percent}</label>
            <input
              type="range"
              disabled={loading}
              min={10}
              max={60}
              value={percent}
              onChange={(event) => {
                setPercent(Number(event.target.value));
                handleMonthPay();
                handleSumTreaty();
              }}
            />
          </div>
          <div className="c-calc-price">
            <h5>Срок лизинга</h5>
            <input
              type="text"
              disabled={loading}
              value={lease}
              onChange={(event) => {
                if (Number(event.target.value) > 60 || isNaN(lease)) {
                  setLease(60);
                } else if (Number(event.target.value) < 1 || isNaN(lease)) {
                  setLease(1);
                } else {
                  setLease(Number(event.target.value));
                }
                handleMonthPay();
                handleSumTreaty();
              }}
              min="1"
              max="60"
            />
            <label htmlFor="price">мес.</label>
            <input
              type="range"
              disabled={loading}
              min={1}
              max={60}
              step={1}
              value={lease}
              onChange={(event) => {
                setLease(event.target.value);
                handleMonthPay();
                handleSumTreaty();
              }}
            />
          </div>
        </div>
        <div className="c-result">
          <div className="c-result-lease" id="it">
            <h6 className="c-result-title">Сумма договора лизинга</h6>
            <div className="c-result-res">
              {sumTreaty <= 0 || isNaN(sumTreaty)
                ? 0
                : sumTreaty.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}
            </div>
          </div>
          <div className="c-result-lease" id="mp">
            <h6 className="c-result-title">Ежемесячный платеж от</h6>
            <div className="c-result-res">
              {monthPay <= 0 || isNaN(monthPay)
                ? 0
                : monthPay.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}
            </div>
          </div>
          <button className="c-result-btn" type="submit" disabled={loading}>
            {loading ? (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              "Отправить заявку"
            )}
          </button>
        </div>
        {successSend && <h5>Отправлено!</h5>}
        {errorSend && <h5>Ошибка!</h5>}
      </form>
    </div>
  );
}

export default App;
