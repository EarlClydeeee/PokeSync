type NavButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    label: string;
  };
  
  export function NavButton({ onClick, disabled = false, label }: NavButtonProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-lg border px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {label}
      </button>
    );
  }
  
  export function NextButton(props: Omit<NavButtonProps, "label">) {
    return <NavButton {...props} label="Next" />;
  }
  
  export function PreviousButton(props: Omit<NavButtonProps, "label">) {
    return <NavButton {...props} label="Previous" />;
  }
  