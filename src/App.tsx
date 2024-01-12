import {useEffect, useState} from 'react'
import classes from './App.module.scss'
import Header from "./components/header/Header.tsx";
import AmortizationTable from "./components/amortization-table/AmortizationTable.tsx";
import RepaymentDetails from "./components/repayment-details/RepaymentDetails.tsx";

function App() {
    const [results, setResults] = useState<Results>(
        {
            repaymentAmount: 0,
            totalInterest: 0,
            loanAmount: 0,
            costOfCredit: 0
        }
    );

  const [loanForm, setLoanForm] = useState({
      initialAmount: { value: 1200000, error: '' },
      deposit: { value: 400000, error: '' },
      interest: { value: 0, error: '' },
      term: { value: 1, error: '' },
      additionalPayment: { value: 0, error: '' }
  });

  useEffect(() => {
      fetch('https://custom.resbank.co.za/SarbWebApi/WebIndicators/CurrentMarketRates')
          .then(data => data.json())
          .then(jsonResponse => {
              const data = jsonResponse.filter(marketIndicator => marketIndicator['Name'] === 'Prime lending rate')
              setLoanForm(prevState => {
                  return ({...prevState, interest: {...prevState.interest, value: data[0]['Value']}})
              })
          })
  }, []);

  function handleFormUpdate(controlName: string, value: string, event?: any) {
      if (isNaN(value)) {
          // @ts-ignore
          setLoanForm(prevState => ({...prevState, [controlName]: {...prevState[controlName], error: 'Enter a valid value'}}))
          return
      }

      if (+value < 0) {
          // @ts-ignore
          setLoanForm(prevState => ({...prevState, [controlName]: {...prevState[controlName], error: 'Enter a valid value'}}))
          return
      }

      if (controlName == 'deposit' && +value >= loanForm.initialAmount.value) {
          // @ts-ignore
          setLoanForm(prevState => ({...prevState, deposit: {...prevState['deposit'], error: 'Enter a valid value'}}))
          return
      }

      // @ts-ignore
      setLoanForm(prevState => ({...prevState, [controlName]: {value: +value, error: ''}}))
  }

    /**
     * https://www.moneygeek.com/personal-loans/calculate-loan-payments/
     * P = a ÷ { [ (1 + r) n ] - 1 } ÷ [ r (1 + r) n]
     * P is your monthly loan payment
     * a is your principal
     * r is your periodic interest rate, which is your interest rate divided by 12
     * n is the total number of months in your loan term
     */
    function handleCalculate(event) {
        event.preventDefault()

        for (const loanFormKey in loanForm) {
            if (loanForm[loanFormKey].error.length) {
                console.error('invalid form', loanFormKey)
                return
            }
        }

        const a = loanForm.initialAmount.value - loanForm.deposit.value;
        const r = (+loanForm.interest.value / 100) / 12;
        const n = +loanForm.term.value * 12;
        const p =(a) / ((  Math.pow((1 + r), n)  - 1 ) / ( r * Math.pow((1 + r), n)));

        const totalPayments = p * n;
        console.log(totalPayments)
        console.log(loanForm.initialAmount.value)
        const totalInterest = totalPayments - a;

        setResults(prevState => ({
            repaymentAmount: p,
            totalInterest: totalInterest,
            loanAmount: a,
            costOfCredit: totalPayments
        }))

    }

  return (
    <>
      <Header></Header>

        <form className={classes.calculator} action="" onSubmit={handleCalculate}>

            <div className={classes.control}>
                <label htmlFor="initialAmount">Initial Amount</label>
                <input type="text" id='initialAmount' value={loanForm.initialAmount.value}
                       onChange={(event) =>
                           handleFormUpdate('initialAmount', event.target.value)}/>
                <div className={classes.errorContainer}>
                    <p>{loanForm.initialAmount.error}</p>
                </div>
            </div>

            <div className={classes.control}>
                <label htmlFor="deposit">Deposit</label>
                <input type="text" id='deposit' value={loanForm.deposit.value}
                       onChange={(event) =>
                           handleFormUpdate('deposit', event.target.value)}/>
                <div className={classes.errorContainer}>
                    <p>{loanForm.deposit.error}</p>
                </div>
            </div>

            <div className={classes.control}>
                <label htmlFor="interest">Interest</label>
                <input type="text" id='interest' value={loanForm.interest.value}
                       onChange={(event) =>
                           handleFormUpdate('interest', event.target.value)}/>
                <div className={classes.errorContainer}>
                    <p>{loanForm.interest.error}</p>
                </div>
            </div>

            <div className={classes.control}>
                <label htmlFor="term">Term: {loanForm.term.value} years</label>
                <input type="range" min='0' max='30' id='term' value={loanForm.term.value}
                       onChange={(event) =>
                           handleFormUpdate('term', event.target.value, event)}/>

                <div className={classes.errorContainer}>
                    <p>{loanForm.term.error}</p>
                </div>
            </div>

            <div className={classes.control}>
                <label htmlFor="additionalPayment">Additional Payment</label>
                <input type="text" id='additionalPayment' value={loanForm.additionalPayment.value}
                       onChange={(event) =>
                           handleFormUpdate('additionalPayment', event.target.value)}/>

                <div className={classes.errorContainer}>
                    <p>{loanForm.additionalPayment.error}</p>
                </div>
            </div>

            <button type='submit'>Calculate</button>

        </form>

        <RepaymentDetails costOfCredit={results!.costOfCredit} loanAmount={results!.loanAmount} repaymentAmount={results!.repaymentAmount} totalInterest={results!.totalInterest}></RepaymentDetails>
        
        <AmortizationTable openingBalance={results!.loanAmount} monthlyPayment={results!.repaymentAmount} interestRate={(loanForm.interest.value / 100) /12 } termMonths={loanForm.term.value * 12}></AmortizationTable>
    </>
  )
}

export default App
