import {useEffect, useState} from "react";
import classes from "./AmortizationTable.module.scss"

interface Props {
    openingBalance: number,
    monthlyPayment: number,
    interestRate: number,
    termMonths: number
}

interface Balance {
    month: number,
    payment: number,
    interest: number,
    principal: number,
    closingBalance: number
}

export default function AmortizationTable({openingBalance, monthlyPayment, interestRate, termMonths}: Props) {

    const [balances, setBalances] = useState<Balance[]>([])
    const [additionalPayment, setAdditionalPayment] = useState( { value: 0, error: '' });

    function calculate() {
        const balances: Balance[] = [];

        console.log(termMonths)

        let closingBalance = openingBalance;
        for (let i = 0; i < termMonths; i++) {
            const interest = closingBalance * interestRate;
            const principal = (monthlyPayment + additionalPayment.value) - interest;
            closingBalance = closingBalance - principal;

            balances.push({
                month: i + 1,
                payment: monthlyPayment,
                interest: interest,
                principal: principal,
                closingBalance: closingBalance
            });
        }

        setBalances(balances)
    }

    useEffect(() => {
        calculate();
    }, [openingBalance, monthlyPayment, interestRate, termMonths, additionalPayment.value])

    function onAddUpdsate(event) {
        if (isNaN(event.target.value)) {
            setAdditionalPayment(prevState => ({...prevState, error: 'Enter a valid value'}))
            return
        }

        if (+event.targetvalue < 0) {
            setAdditionalPayment(prevState => ({...prevState, error: 'Enter a valid value'}))
            return
        }

        setAdditionalPayment(prevState => ({...prevState, value: +event.target.value}))
        calculate();
    }

    return (
        <>

            <div className={classes.additionalPayment}>
                <label htmlFor="additionalPayment">Additional Payment</label>
                <input type="text" id='additionalPayment' value={additionalPayment.value}
                       onChange={onAddUpdsate}/>

                <div className={classes.errorContainer}>
                    <p>{additionalPayment.error}</p>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Month</th>
                    <th>Payment</th>
                    <th>Interest</th>
                    <th>Principal</th>
                    <th>Closing Balance</th>
                </tr>
                </thead>
                <tbody>
                {balances.map((balance, index) => {
                    return (
                        <tr key={index}>
                            <td>{balance.month.toLocaleString('en-US')}</td>
                            <td>{balance.payment.toLocaleString('en-US')}</td>
                            <td>{balance.interest.toLocaleString('en-US')}</td>
                            <td>{balance.principal.toLocaleString('en-US')}</td>
                            <td>{balance.closingBalance.toLocaleString('en-US')}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
    );

}