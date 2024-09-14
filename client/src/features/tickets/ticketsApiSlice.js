import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const ticketsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})
const initialState = ticketsAdapter.getInitialState()

export const ticketsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTickets: builder.query({
            query: () => '/tickets',            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedTickets = responseData.map(ticket => {
                    ticket.id = ticket._id
                    return ticket
                })
                return ticketsAdapter.setAll(initialState, loadedTickets)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'Ticket', id: "LIST"},
                        ...result.ids.map(id => ({type: 'Ticket', id}))
                    ] 
                } else return [{type: 'Ticket', id: "LIST"}]
            }
        }),
        addNewTicket: builder.mutation({
            query: initialTicket => ({
                url: '/tickets',
                method: 'POST',
                body: {
                    ...initialTicket,
                }
            }),
            invalidatesTags: [
                {type: 'Ticket', id: "LIST"}
            ]
        }),
        updateTicket: builder.mutation({
            query: initialTicket => ({
                url: '/tickets',
                method: 'PATCH',
                body: {
                    ...initialTicket,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Ticket', id: arg.id}
            ]
        }),
        deleteTicket: builder.mutation({
            query: ({id}) => ({
                url: '/tickets',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Ticket', id: arg.id}
            ]
        })
    })
})

export const {
    useGetTicketsQuery,
    useAddNewTicketMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation
} = ticketsApiSlice
export const selectTicketsResult = ticketsApiSlice.endpoints.getTickets.select()

const selectTicketsData = createSelector(selectTicketsResult, ticketsResult => ticketsResult.data)

export const {
    selectAll: selectAllTickets,
    selectById: selectTicketById,
    selectIds: selectTicketIds
} = ticketsAdapter.getSelectors(state => selectTicketsData(state) ?? initialState)
