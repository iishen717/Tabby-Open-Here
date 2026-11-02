using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Win32;

class Program
{
    [DllImport("user32.dll", CharSet = CharSet.Unicode)]
    private static extern int MessageBoxW(IntPtr hWnd, string text, string caption, uint type);

    static int Main(string[] args)
    {
        string target = args.Length > 0 ? args[0] : Environment.CurrentDirectory;
        target = (target ?? string.Empty).Trim();
        if (target.Length >= 2 && target[0] == '"' && target[target.Length - 1] == '"')
        {
            target = target.Substring(1, target.Length - 2);
        }
        target = Environment.ExpandEnvironmentVariables(target);
        if (target.Length > 3 && (target.EndsWith("\\") || target.EndsWith("/")))
        {
            target = target.Substring(0, target.Length - 1);
        }
        try
        {
            if (File.Exists(target))
            {
                target = Path.GetDirectoryName(target);
            }
        }
        catch { }
        if (string.IsNullOrEmpty(target) || !Directory.Exists(target))
        {
            target = Environment.CurrentDirectory;
        }

        string baseDir = Environment.GetEnvironmentVariable("TABBY_OPEN_HERE_DIR");
        if (string.IsNullOrEmpty(baseDir))
        {
            baseDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "TabbyOpenHere");
        }

        string tabby = ReadFirstLine(Path.Combine(baseDir, "tabby-path.txt"));
        if (!IsExecutable(tabby))
        {
            tabby = ReadProtocolPath();
        }
        if (!IsExecutable(tabby))
        {
            tabby = FindCommonTabby();
        }

        if (!IsExecutable(tabby))
        {
            WriteLog(baseDir, "Tabby.exe not found. target=" + target);
            MessageBoxW(IntPtr.Zero,
                "无法启动 Tabby：未找到 Tabby.exe。\nCannot start Tabby: Tabby.exe was not found.\n\n请打开 Tabby → 设置 → Open Here 重新配置。\nOpen Tabby → Settings → Open Here to reconfigure.",
                "Tabby Open Here", 0x10);
            return 1;
        }

        try
        {
            // 目录以反斜杠结尾（如 D:\）时，参数里的反斜杠会转义闭合引号；
            // 追加一个反斜杠，确保 CommandLineToArgvW 解析出完整目录。
            string argumentTarget = target;
            if (argumentTarget.EndsWith("\\"))
            {
                argumentTarget = argumentTarget + "\\";
            }
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = tabby;
            psi.Arguments = "open \"" + argumentTarget + "\"";
            psi.WorkingDirectory = target;
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            Process.Start(psi);
            return 0;
        }
        catch (Exception ex)
        {
            WriteLog(baseDir, "Launch failed: " + ex.Message + " tabby=" + tabby + " target=" + target);
            MessageBoxW(IntPtr.Zero,
                "无法启动 Tabby。\nCould not start Tabby.\n\n" + ex.Message,
                "Tabby Open Here", 0x10);
            return 2;
        }
    }

    static bool IsExecutable(string value)
    {
        if (string.IsNullOrEmpty(value)) return false;
        if (!value.EndsWith(".exe", StringComparison.OrdinalIgnoreCase)) return false;
        try { return File.Exists(value); } catch { return false; }
    }

    static string ReadFirstLine(string file)
    {
        try
        {
            if (!File.Exists(file)) return null;
            string[] lines = File.ReadAllLines(file);
            if (lines.Length == 0) return null;
            return lines[0].Trim();
        }
        catch { return null; }
    }

    static string ReadProtocolPath()
    {
        try
        {
            using (RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Software\Classes\tabby\shell\open\command"))
            {
                if (key == null) return null;
                object value = key.GetValue(string.Empty);
                return ParseQuotedPath(value as string);
            }
        }
        catch { return null; }
    }

    static string ParseQuotedPath(string command)
    {
        if (string.IsNullOrEmpty(command)) return null;
        string s = command.Trim();
        if (s.Length == 0) return null;
        if (s[0] == '"')
        {
            int end = s.IndexOf('"', 1);
            if (end > 1) return s.Substring(1, end - 1);
            return null;
        }
        int space = s.IndexOf(' ');
        return space > 0 ? s.Substring(0, space) : s;
    }

    static string FindCommonTabby()
    {
        string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
        string programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
        string[] candidates = new string[]
        {
            Path.Combine(local, "Programs", "tabby", "Tabby.exe"),
            Path.Combine(programFiles, "Tabby", "Tabby.exe"),
            Path.Combine(programFilesX86, "Tabby", "Tabby.exe"),
        };
        foreach (string candidate in candidates)
        {
            if (IsExecutable(candidate)) return candidate;
        }
        return null;
    }

    static void WriteLog(string baseDir, string message)
    {
        try
        {
            Directory.CreateDirectory(baseDir);
            File.AppendAllText(
                Path.Combine(baseDir, "launcher.log"),
                DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " " + message + Environment.NewLine,
                Encoding.UTF8);
        }
        catch { }
    }
}
