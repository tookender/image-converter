export const Footer = () => {
  return (
    <footer className="mt-12 mb-12 border-t-muted border-t-2 text-muted-foreground flex flex-col gap-4 md:flex-row md:justify-between">
      <div className="ml-4 mt-4">
        <p>Free forever in-browser image converter</p>
        <h1>
          Made by{" "}
          <a
            className="font-bold text-sky-500"
            title="Ender Personal Portfolio"
            href="https://korino.dev"
            target="_blank"
          >
            tookender
          </a>
        </h1>
      </div>

      <div className="mr-4 mt-4 ml-4 md:ml-0">
        <p>
          Missing a feature? Request it{" "}
          <a
            className="font-bold text-sky-500"
            title="GitHub Issues Page"
            href="https://github.com/tookender/image-converter/issues"
            target="_blank"
          >
            here
          </a>
        </p>
      </div>
    </footer>
  );
};
