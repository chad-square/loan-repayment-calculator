import {useState} from 'react'
import Header from "./components/header/Header.tsx";
import AmortizationTable from "./components/amortization-table/AmortizationTable.tsx";
import RepaymentDetails from "./components/repayment-details/RepaymentDetails.tsx";
import LoanForm from "./components/loan-form/LoanForm.tsx";

function App() {
    const [results, setResults] = useState<Results>(
        {
            repaymentAmount: 0,
            totalInterest: 0,
            loanAmount: 0,
            costOfCredit: 0,
            rate: 0,
            termMonths: 0,
        }
    );

    function onSetResults(res: Results) {
        setResults(res);
    }

  return (
    <>
        <Header/>

        <main>
            <LoanForm handleResults={onSetResults}></LoanForm>

            <RepaymentDetails costOfCredit={results!.costOfCredit} loanAmount={results!.loanAmount}
                              repaymentAmount={results!.repaymentAmount} totalInterest={results!.totalInterest}/>

            <AmortizationTable openingBalance={results!.loanAmount} monthlyPayment={results!.repaymentAmount}
                               interestRate={results.rate} termMonths={results.termMonths}/>
        </main>

    </>
  )
}

export default App
