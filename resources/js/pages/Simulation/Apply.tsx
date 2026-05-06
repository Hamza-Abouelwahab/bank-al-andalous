export default function Loans({ loans }: any) {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">My Loans</h1>

            {loans.map((loan: any) => (
                <div key={loan.id} className="mb-3 p-4 border rounded-xl">
                    <p>{loan.amount} MAD</p>
                    <p>Status: {loan.status}</p>
                </div>
            ))}
        </div>
    );
}