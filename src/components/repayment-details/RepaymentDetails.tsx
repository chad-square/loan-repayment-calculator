import classes from "../../App.module.scss";

interface RepaymentDetailsProps {
    repaymentAmount: number,
    totalInterest: number,
    loanAmount: number,
    costOfCredit: number
}

export default function RepaymentDetails({repaymentAmount, loanAmount, totalInterest, costOfCredit}: RepaymentDetailsProps) {

    return (
        <div className={classes.results}>
            <h4>Repayment Details</h4>
            <div className={classes.details}>
                <div className={classes.titles}>
                    <span>Loan amount:</span>
                    <span>Monthly repayment:</span>
                    <span>Total interest:</span>
                    <span>Cost of credit:</span>
                </div>
                <div className={classes.amounts}>
                    <span>{loanAmount.toLocaleString('en-US')}</span>
                    <span>{repaymentAmount.toLocaleString('en-US')}</span>
                    <span>{totalInterest.toLocaleString('en-US')}</span>
                    <span>{costOfCredit.toLocaleString('en-US')}</span>
                </div>
            </div>
        </div>
    )
}