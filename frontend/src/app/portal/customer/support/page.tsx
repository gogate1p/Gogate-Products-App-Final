"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Headphones,
  MessageCircleMore,
  Send,
} from "lucide-react";

import {
  CustomerApi,
} from "@/lib/customer-api";

export default function Page() {
  const [tickets, setTickets] =
    useState<any[]>([]);

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [awb, setAwb] =
    useState("");

  const [category, setCategory] =
    useState("GENERAL");

  const [selected, setSelected] =
    useState<any>(null);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [reply, setReply] =
    useState("");

  const [error, setError] =
    useState("");

  async function load() {
    try {
      const data =
        await CustomerApi.tickets();

      setTickets(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (error: any) {
      setError(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    try {
      setError("");

      await CustomerApi.createTicket({
        subject,
        message,
        awb:
          awb || undefined,
        category,
      });

      setSubject("");
      setMessage("");
      setAwb("");

      await load();
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function openTicket(
    ticket: any,
  ) {
    setSelected(ticket);

    const data =
      await CustomerApi.ticketMessages(
        ticket.id,
      );

    setMessages(
      Array.isArray(data)
        ? data
        : [],
    );
  }

  async function sendReply() {
    if (
      !selected ||
      !reply.trim()
    ) {
      return;
    }

    await CustomerApi.sendTicketMessage(
      selected.id,
      reply.trim(),
    );

    setReply("");

    await openTicket(
      selected,
    );
  }

  return (
    <div className="mx-auto max-w-6xl">

      <div className="flex items-center gap-3">

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-[#0284c7]">
          <Headphones size={23} />
        </div>

        <div>
          <h1 className="text-3xl font-black">
            Customer Care
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Raise shipment issues and continue conversations with support.
          </p>
        </div>

      </div>

      {error && (
        <div className="mt-5 rounded-2xl bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">

        <section className="rounded-3xl border border-slate-200 bg-white p-6">

          <div className="font-black">
            New Support Request
          </div>

          <select
            value={category}
            onChange={
              event =>
                setCategory(
                  event.target.value,
                )
            }
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <option value="GENERAL">
              General
            </option>

            <option value="DELIVERY">
              Delivery Issue
            </option>

            <option value="PICKUP">
              Pickup Issue
            </option>

            <option value="PAYMENT">
              Payment
            </option>

            <option value="DAMAGE">
              Damage / Loss
            </option>
          </select>

          <input
            value={awb}
            onChange={
              event =>
                setAwb(
                  event.target.value,
                )
            }
            placeholder="Shipment ID / AWB (optional)"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <input
            value={subject}
            onChange={
              event =>
                setSubject(
                  event.target.value,
                )
            }
            placeholder="Subject"
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <textarea
            value={message}
            onChange={
              event =>
                setMessage(
                  event.target.value,
                )
            }
            placeholder="How can we help?"
            rows={5}
            className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          />

          <button
            onClick={create}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0284c7] py-4 font-black text-white"
          >
            <Send size={16} />
            Send to Customer Care
          </button>

        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">

          <div className="border-b border-slate-100 p-5 font-black">
            Support Conversations
          </div>

          {!selected ? (
            <div className="divide-y divide-slate-100">

              {!tickets.length ? (
                <div className="p-12 text-center text-slate-400">
                  No support requests.
                </div>
              ) : (
                tickets.map(
                  ticket => (
                    <button
                      key={ticket.id}
                      onClick={
                        () =>
                          openTicket(
                            ticket,
                          )
                      }
                      className="w-full p-5 text-left transition hover:bg-slate-50"
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div>

                          <div className="font-black">
                            {ticket.subject}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            Ticket {ticket.ticketCode}
                            {
                              ticket.awb
                                ? ` · AWB ${ticket.awb}`
                                : ""
                            }
                          </div>

                        </div>

                        <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black text-[#0284c7]">
                          {ticket.status}
                        </span>

                      </div>

                    </button>
                  ),
                )
              )}

            </div>
          ) : (
            <div>

              <button
                onClick={
                  () => {
                    setSelected(null);
                    setMessages([]);
                  }
                }
                className="m-5 text-xs font-black text-[#0284c7]"
              >
                ← All conversations
              </button>

              <div className="border-y border-slate-100 p-5">

                <div className="font-black">
                  {selected.subject}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Ticket {selected.ticketCode}
                </div>

              </div>

              <div className="max-h-[430px] space-y-3 overflow-y-auto p-5">

                {messages.map(
                  item => (
                    <div
                      key={item.id}
                      className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                        item.senderType ===
                        "CUSTOMER"
                          ? "ml-auto bg-[#0284c7] text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.message}
                    </div>
                  ),
                )}

              </div>

              <div className="flex gap-2 border-t border-slate-100 p-4">

                <input
                  value={reply}
                  onChange={
                    event =>
                      setReply(
                        event.target.value,
                      )
                  }
                  placeholder="Write a message..."
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />

                <button
                  onClick={sendReply}
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0284c7] text-white"
                >
                  <MessageCircleMore size={18} />
                </button>

              </div>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}