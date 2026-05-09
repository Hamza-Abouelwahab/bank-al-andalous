<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Statement</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #15110D;
            font-size: 12px;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }

        .page {
            padding: 32px;
        }

        .header {
            background: #15110D;
            color: white;
            padding: 24px;
            border-radius: 14px;
        }

        .brand {
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .subtitle {
            color: #F6B088;
            margin-top: 6px;
            font-size: 12px;
        }

        .section {
            margin-top: 24px;
        }

        .grid {
            width: 100%;
            border-collapse: collapse;
        }

        .info-card {
            border: 1px solid #EDE8E0;
            padding: 14px;
            border-radius: 12px;
            background: #F8F6F1;
        }

        .label {
            color: #8A8178;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .value {
            font-size: 13px;
            font-weight: bold;
        }

        .summary-table {
            width: 100%;
            margin-top: 18px;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 12px;
            border: 1px solid #EDE8E0;
        }

        .transactions {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        .transactions th {
            background: #FF4B00;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
        }

        .transactions td {
            padding: 10px;
            border-bottom: 1px solid #EDE8E0;
            font-size: 11px;
        }

        .right {
            text-align: right;
        }

        .deposit {
            color: #15803d;
            font-weight: bold;
        }

        .withdraw {
            color: #b91c1c;
            font-weight: bold;
        }

        .footer {
            margin-top: 28px;
            padding-top: 14px;
            border-top: 1px solid #EDE8E0;
            color: #8A8178;
            font-size: 10px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="page">
        <div class="header">
            <div class="brand">BANK AL-ANDALOUS</div>
            <div class="subtitle">Official Account Statement</div>
        </div>

        <div class="section">
            <table class="grid">
                <tr>
                    <td width="50%" style="padding-right: 8px;">
                        <div class="info-card">
                            <div class="label">Account holder</div>
                            <div class="value">{{ $user->name }}</div>
                            <br>
                            <div class="label">Email</div>
                            <div class="value">{{ $user->email }}</div>
                            <br>
                            <div class="label">CIN</div>
                            <div class="value">{{ $profile?->cin ?? 'N/A' }}</div>
                        </div>
                    </td>

                    <td width="50%" style="padding-left: 8px;">
                        <div class="info-card">
                            <div class="label">Account number</div>
                            <div class="value">{{ $account->account_number }}</div>
                            <br>
                            <div class="label">RIP</div>
                            <div class="value">{{ $account->rip ?? 'N/A' }}</div>
                            <br>
                            <div class="label">Account type</div>
                            <div class="value">{{ ucfirst($account->account_type) }}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="label">Current balance</div>
                        <div class="value">{{ number_format($account->balance, 2) }} MAD</div>
                    </td>
                    <td>
                        <div class="label">Total deposits</div>
                        <div class="value deposit">{{ number_format($totalDeposits, 2) }} MAD</div>
                    </td>
                    <td>
                        <div class="label">Total withdrawals</div>
                        <div class="value withdraw">{{ number_format($totalWithdrawals, 2) }} MAD</div>
                    </td>
                    <td>
                        <div class="label">Generated at</div>
                        <div class="value">{{ $generatedAt->format('Y-m-d H:i') }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h3>Recent Transactions</h3>

            <table class="transactions">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th class="right">Amount</th>
                        <th class="right">Status</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($transactions as $transaction)
                        <tr>
                            <td>{{ $transaction->created_at->format('Y-m-d') }}</td>
                            <td>{{ ucfirst($transaction->type) }}</td>
                            <td>{{ $transaction->description ?? 'Bank transaction' }}</td>
                            <td class="right {{ in_array($transaction->type, ['deposit']) ? 'deposit' : 'withdraw' }}">
                                {{ number_format($transaction->amount, 2) }} MAD
                            </td>
                            <td class="right">{{ ucfirst($transaction->status ?? 'completed') }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" style="text-align:center; padding: 20px;">
                                No transactions found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="footer">
            This document was generated electronically by Bank Al-Andalous.
            Please verify all information before official use.
        </div>
    </div>
</body>
</html>