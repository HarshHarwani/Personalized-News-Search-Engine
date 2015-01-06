package DBUtils.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import util.DBUtilException;
import util.DBUtils;

import org.apache.log4j.Logger;

@WebServlet(name = "Login", urlPatterns = { "/Login" })
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static Logger logger = Logger.getLogger(LoginServlet.class);

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String userId = request.getParameter("email");
		String errorMsg = "User Not Found";
		User user = null;
		Connection con = (Connection) getServletContext().getAttribute("DBConnection");
		DBUtils dbUtils = null;
		try {
			dbUtils = new DBUtils(con);
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		} catch (SQLException e1) {
			e1.printStackTrace();
		}
		try {
			if (dbUtils.isUserExists(userId)) {
				HttpSession session = request.getSession();
				try {
					user = dbUtils.PopulateUserData(userId);
				} catch (DBUtilException e) {
					e.printStackTrace();
				}
				session.setAttribute("User", user);
				user.printString();
				Map<String, String> prefCatMap = new HashMap<String, String>();
				// First case where Category and Preference both are present
				prefCatMap.put("stephen hawking", "Science and Technology");
				// Second case where Preference is not present and category
				// is present
				prefCatMap.put("Alan Turing", "Science and Technology");
				// Third Case where prefernce is present and Category is not
				// present
				prefCatMap.put("Alan Turing", "Music");
				// Fourth Case where both prefernce and category are not
				// present
				prefCatMap.put("Fank Mody", "Architecture");
				try {
					dbUtils.InsertPreCatMapIntoDB(userId, prefCatMap);
				} catch (DBUtilException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				response.sendRedirect("home.jsp");
				logger.info("User found");
			} else {
				RequestDispatcher rd = getServletContext().getRequestDispatcher("/login.html");
				PrintWriter out = response.getWriter();
				out.println("<font color=red>" + errorMsg + "</font>");
				rd.include(request, response);
			}
		} catch (SQLException e) {
			e.printStackTrace();
			logger.error("Database connection problem");
			throw new ServletException("DB Connection problem.");
		}

	}

}