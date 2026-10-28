import Link from "next/link";

const steps = [
  {
    no: "1",
    title: "推しを登録",
    body: "応援したい連載のタイトル・掲載誌・作者を登録します。",
  },
  {
    no: "2",
    title: "毎週の掲載順を記録",
    body: "号数と掲載順を入れるだけ。推移が折れ線グラフになります。",
  },
  {
    no: "3",
    title: "ピンチに気づく",
    body: "3回続けて掲載順が下がったら「ピンチ」ラベルでお知らせ。",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-bold tracking-widest text-accent">
          連載漫画のファンの応援ナビ
        </p>
        <h1 className="font-display text-5xl leading-tight sm:text-6xl">
          推しマモ
        </h1>
      </header>

      <section className="mb-10 border-[2.5px] border-ink bg-panel p-5 shadow-[4px_4px_0_var(--color-ink)] sm:p-8">
        <h2 className="mb-3 font-display text-2xl leading-snug sm:text-3xl">
          推しの連載を、
          <br />
          <span className="text-accent">打ち切り</span>から守ろう。
        </h2>
        <p className="text-ink-soft">
          連載が続くかどうかは、読者アンケートの順位などで決まると言われています。
          掲載順が下がり続けているのは、作品からのSOSかもしれません。
          推しマモは毎週の掲載順を記録して、ピンチに早く気づけるようにします。
        </p>
      </section>

      <section className="mb-10" aria-labelledby="how-to">
        <h2 id="how-to" className="mb-4 font-display text-xl">
          使い方
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.no}
              className="border-[2.5px] border-ink bg-panel p-4"
            >
              <span className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-paper">
                {step.no}
              </span>
              <h3 className="mb-1 font-bold">{step.title}</h3>
              <p className="text-sm text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-block border-[2.5px] border-ink bg-accent px-8 py-3 font-bold text-white shadow-[4px_4px_0_var(--color-ink)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--color-ink)]"
        >
          Googleでログインして始める
        </Link>
        <p className="mt-3 text-xs text-ink-soft">
          漫画の画像や本文は扱いません。記録するのはタイトルと掲載順だけです。
        </p>
      </div>
    </main>
  );
}
