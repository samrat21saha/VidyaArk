// pages/AboutUs.jsx
import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-zinc-950 text-zinc-100 min-h-screen px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-14">

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About VidyaArk
          </h1>
          <p className="text-zinc-400 max-w-3xl text-lg">
            VidyaArk, short for <span className="text-yellow-100 font-medium">Vidya Archive</span>,
            is a centralized platform that brings together free and trusted
            e-books from across the internet into one unified destination.
          </p>
        </header>

        {/* Vision */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-zinc-300 leading-relaxed">
              VidyaArk is built with a simple vision: to ensure that access to
              free knowledge is never delayed by scattered sources or endless
              searching. We aim to make educational content easy to discover,
              reliable to access, and effortless to consume.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-zinc-300 leading-relaxed">
              Our mission is to aggregate freely available e-book PDFs from
              trusted sources worldwide and present them through a single,
              searchable platform—allowing users to focus on reading and
              learning rather than hunting for resources.
            </p>
          </div>
        </div>

        {/* Platform Highlights */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Platform Highlights</h2>
          <ul className="grid md:grid-cols-2 gap-6 text-zinc-300">
            <li className="bg-zinc-900 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">
                Centralized Knowledge Archive
              </h3>
              <p>
                A single platform that consolidates free e-books from multiple
                reliable sources, eliminating the need to browse countless
                websites.
              </p>
            </li>

            <li className="bg-zinc-900 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">
                Trusted & Accessible Content
              </h3>
              <p>
                Every listed resource is sourced from reputable platforms,
                ensuring users can access free learning material with
                confidence.
              </p>
            </li>

            <li className="bg-zinc-900 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">
                One-Stop Search Experience
              </h3>
              <p>
                Explore e-books across multiple categories from a single
                interface—designed to save time and reduce discovery effort.
              </p>
            </li>

            <li className="bg-zinc-900 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">
                Focused on Learning
              </h3>
              <p>
                VidyaArk prioritizes simplicity and usability so users can spend
                their time reading and learning, not searching for PDFs.
              </p>
            </li>
          </ul>
        </div>

        {/* Closing Statement */}
        <footer className="border-t border-zinc-800 pt-8">
          <p className="text-zinc-400 max-w-4xl">
            VidyaArk is more than a collection of links—it is a structured
            knowledge archive designed to unlock free education with minimal
            friction. With just one click, learners can access global knowledge
            anytime and start reading instantly.
          </p>
        </footer>

      </div>
    </section>
  );
};

export default AboutUs;
