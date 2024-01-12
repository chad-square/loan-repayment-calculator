import {useEffect, useState} from "react";
import "./AmortizationTable.module.scss"

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

    useEffect(() => {
        const balances: Balance[] = [];

        console.log(termMonths)

        let closingBalance = openingBalance;
        for (let i = 0; i < termMonths; i++) {
            const interest = closingBalance * interestRate;
            const principal = monthlyPayment - interest;
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
    }, [openingBalance, monthlyPayment, interestRate, termMonths])

    return (
        <>
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