export default function Settings() {
  const handleSetting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-10">Settings</h2>
      <form className="space-y-8" onSubmit={handleSetting}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="languages" className="font-semibold">
            Display language
          </label>
          <select className="select">
            <option disabled={true}>Pick a language</option>
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Vietnamese</option>
          </select>
        </div>
        <div className="flex items-end space-x-4">
          <label htmlFor="dark-mode" className="font-semibold">
            Dark mode
          </label>
          <input type="checkbox" id="dark-mode" className="toggle" />
        </div>
      </form>
    </div>
  );
}
