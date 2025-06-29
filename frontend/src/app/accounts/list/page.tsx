"use server"

import AccountsList from "@/components/views/accounts/list/listAccounts"
import GraphGroupByAccountsAndTimeStamp from "@/components/views/transactions/graphs/graphGroupByAccountsAndTimestamp"

export default async function AccountsListPage () {
    return (
        <div>
            <AccountsList />
        </div>
    )
}