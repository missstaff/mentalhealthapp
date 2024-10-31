import { getUserContacts, saveUserContact, deleteUserContact} from "../controllers/userContactsController";
import router from "./auth_routes";

router.get('/getusercontacts/:userId', getUserContacts);
router.post('/saveusercontact/:userId', saveUserContact);
router.delete('/deleteusercontact/:userId/:contactId', deleteUserContact);

export default router;