"use client";

import {
  Check,
  Circle,
} from "lucide-react";

type TrackingStep = {
  title: string;
  state:
    | "COMPLETED"
    | "CURRENT"
    | "UPCOMING";
};

export function ShipmentProgress({
  steps,
}: {
  steps: TrackingStep[];
}) {
  return (
    <>
      {/* DESKTOP / TABLET */}

      <div className="hidden overflow-x-auto pb-3 md:block">

        <div className="flex min-w-[760px] items-start px-2">

          {steps.map(
            (
              step,
              index,
            ) => {

              const done =
                step.state ===
                "COMPLETED";

              const active =
                step.state ===
                "CURRENT";

              return (
                <div
                  key={step.title}
                  className="relative flex flex-1 flex-col items-center"
                >

                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 top-[19px] h-[4px] w-full overflow-hidden rounded-full ${
                        step.state ===
                        "UPCOMING"
                          ? "bg-slate-200"
                          : "bg-[#159447]"
                      }`}
                    >

                      {active && (
                        <span className="tracking-flow absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
                      )}

                    </div>
                  )}

                  <div
                    className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-4 border-white transition ${
                      done ||
                      active
                        ? "bg-[#159447] text-white shadow-[0_0_0_6px_rgba(21,148,71,.11)]"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {done ? (
                      <Check
                        size={17}
                        strokeWidth={3}
                      />
                    ) : (
                      <Circle
                        size={11}
                        fill="currentColor"
                      />
                    )}
                  </div>

                  <div
                    className={`mt-4 text-center text-sm font-black ${
                      step.state ===
                      "UPCOMING"
                        ? "text-slate-400"
                        : "text-slate-900"
                    }`}
                  >
                    {step.title}
                  </div>

                  {active && (
                    <div className="mt-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#159447]">
                      Current
                    </div>
                  )}

                </div>
              );
            },
          )}

        </div>

      </div>


      {/* MOBILE */}

      <div className="space-y-0 md:hidden">

        {steps.map(
          (
            step,
            index,
          ) => {

            const done =
              step.state ===
              "COMPLETED";

            const active =
              step.state ===
              "CURRENT";

            return (
              <div
                key={step.title}
                className="relative flex gap-4 pb-8"
              >

                <div className="relative flex flex-col items-center">

                  <div
                    className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-[3px] border-white ${
                      done ||
                      active
                        ? "bg-[#159447] text-white shadow-[0_0_0_5px_rgba(21,148,71,.10)]"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {done ? (
                      <Check
                        size={16}
                        strokeWidth={3}
                      />
                    ) : (
                      <Circle
                        size={10}
                        fill="currentColor"
                      />
                    )}
                  </div>

                  {index <
                    steps.length -
                    1 && (
                    <div
                      className={`absolute top-10 h-[calc(100%-2px)] w-[3px] overflow-hidden rounded-full ${
                        step.state ===
                        "UPCOMING"
                          ? "bg-slate-200"
                          : "bg-[#159447]"
                      }`}
                    >

                      {active && (
                        <span className="tracking-flow-vertical absolute left-0 top-0 h-12 w-full bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />
                      )}

                    </div>
                  )}

                </div>


                <div className="pt-2">

                  <div
                    className={`font-black ${
                      step.state ===
                      "UPCOMING"
                        ? "text-slate-400"
                        : "text-slate-900"
                    }`}
                  >
                    {step.title}
                  </div>

                  {active && (
                    <div className="mt-1 text-xs font-black text-[#159447]">
                      Current shipment stage
                    </div>
                  )}

                </div>

              </div>
            );
          },
        )}

      </div>


      <style jsx global>{`
        @keyframes trackingFlow {
          from {
            transform: translateX(-160%);
          }

          to {
            transform: translateX(430%);
          }
        }

        .tracking-flow {
          animation:
            trackingFlow
            1.8s
            linear
            infinite;
        }

        @keyframes trackingFlowVertical {
          from {
            transform: translateY(-150%);
          }

          to {
            transform: translateY(500%);
          }
        }

        .tracking-flow-vertical {
          animation:
            trackingFlowVertical
            1.8s
            linear
            infinite;
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .tracking-flow,
          .tracking-flow-vertical {
            animation:
              none;
          }
        }
      `}</style>
    </>
  );
}